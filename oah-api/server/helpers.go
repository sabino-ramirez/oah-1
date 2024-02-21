package server

import (
	"context"
	"encoding/json"
	"fmt"
	"reflect"

	"log"
	"time"

	"net/http"

	// "github.com/rueian/rueidis"
	"github.com/redis/rueidis"
	"github.com/sabino-ramirez/oah-api/models"
	"github.com/sabino-ramirez/oah-api/services"
)

type reqSummary struct {
	identifier       string
	ovationCreatedAt time.Time
	ovationUpdatedAt time.Time
}

type updates struct {
	counter      int
	redisKeys    []string
	reqSummaries []reqSummary
}

type filteredUpdates struct {
	keys     []string
	jsonReqs []string
}

func getIndividualReq(url string, apiClient *models.PleaseClient, target interface{}) error {

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println("new request error: ")
		return err
	}

	request.Header.Add("Authorization", apiClient.Bearer)

	response, err := apiClient.Http.Do(request)
	// response, err := apiClient.Do(request)
	if err != nil {
		log.Println("request.Do error: ", err)
		return err
	}

	defer response.Body.Close()

	// // use this to see the response body that is causing a problem
	// // ie 'Retry Later' causing json.SyntaxError
	// var msg string
	// b, err := io.ReadAll(response.Body)
	// if err != nil {
	// 	log.Println("Error reading body")
	// 	return err
	// }
	//
	// if response.StatusCode == http.StatusOK {
	// 	if err := json.Unmarshal(b, target); err != nil {
	// 		switch t := err.(type) {
	// 		case *json.SyntaxError:
	// 			jsn := string(b)
	// 			// jsn += "<--(Invalid Character)"
	// 			msg = fmt.Sprintf("Invalid character at offset %v\n %s", t.Offset, jsn)
	// 		case *json.UnmarshalTypeError:
	// 			jsn := string(b[0:t.Offset])
	// 			jsn += "<--(Invalid Type)"
	// 			msg = fmt.Sprintf("Invalid value at offset %v\n %s", t.Offset, jsn)
	// 		default:
	// 			msg = err.Error()
	// 		}
	//
	// 		log.Println(msg)
	// 		return err
	// 	}
	// } else {
	// 	log.Printf("statusCode: %v\nurl: %v\n", response.StatusCode, url)
	// 	log.Println(string(b))
	// 	log.Printf("header: %v", response.Header)
	// }

	// comment this if above snippet is uncommented
	if err := json.NewDecoder(response.Body).Decode(target); err != nil {
		log.Println("decoding error for: ", url)
		log.Println("retry time: ", response.Header.Get("Retry-After"))
		return err
	}

	return nil
}

func filterUpdates(
	redis rueidis.Client,
	a updates,
	currentTemplate models.ProjectTemp,
	apiClient *models.PleaseClient,
	msetReqs *filteredUpdates,
) {

	var tempReq models.JsonToCsvReq

	resultsCmd := redis.B().Mget().Key(a.redisKeys...).Build()
	results, err := redis.Do(context.Background(), resultsCmd).ToAny()
	if err != nil {
		log.Println("mget error:", err)
	} else {
		for ix, res := range results.([]interface{}) {
			if !reflect.ValueOf(res).IsValid() {
				log.Printf("getting %v", a.reqSummaries[ix].identifier)
				url := fmt.Sprintf(
					"https://lab-services.ovation.io/api/v3/project_templates/%v/requisitions/%v",
					currentTemplate.Id, a.reqSummaries[ix].identifier,
				)

				if err := getIndividualReq(url, apiClient, &tempReq); err != nil {
					log.Println("get individual req error:", err)
				} else {
					tempReqJson, err := json.Marshal(tempReq)
					if err != nil {
						log.Println("temp req marshalling error:", err)
					} else {
						msetReqs.keys = append(msetReqs.keys, fmt.Sprintf("req:%v", a.reqSummaries[ix].identifier))
						msetReqs.jsonReqs = append(msetReqs.jsonReqs, string(tempReqJson))
					}
				}
			} else {
				// logic to check for updated outside of OAH
				t, err := time.Parse(time.RFC1123, res.(string))
				if err != nil {
					log.Println("converting redis time string to date error", err)
				} else {
					if a.reqSummaries[ix].ovationUpdatedAt.After(t) {
						log.Printf("updated outside redis: %v", a.reqSummaries[ix].identifier)
						// log.Printf("\nupdated_at: %v\nredis timestamp: %v", a.reqs[ix].ovationUpdatedAt, t)
						// logic to pull req
						url := fmt.Sprintf(
							"https://lab-services.ovation.io/api/v3/project_templates/%v/requisitions/%v",
							currentTemplate.Id, a.reqSummaries[ix].identifier,
						)

						if err := getIndividualReq(url, apiClient, &tempReq); err != nil {
							log.Println("get individual req error:", err)
						} else {
							tempReqJson, err := json.Marshal(tempReq)
							if err != nil {
								log.Println("temp req marshalling error:", err)
							} else {
								msetReqs.keys = append(msetReqs.keys, fmt.Sprintf("req:%v", a.reqSummaries[ix].identifier))
								msetReqs.jsonReqs = append(msetReqs.jsonReqs, string(tempReqJson))
							}
						}
					}
				}
			}
		}
	}
}

func scanForUpdates(
	redis rueidis.Client,
	currentTemplate models.ProjectTemp,
	apiClient *models.PleaseClient,
) {

	// update_at after yesterday
	var a updates

	// updates/additions to get
	var msetReqs filteredUpdates

	var projReqs models.ProjectReqs
	// var tempReq models.JsonToCsvReq

	var totalPages int

	yesterday := time.Now().AddDate(0, 0, -2)

	statusCode, err := services.GetProjectReqs(apiClient, currentTemplate.Id, &projReqs, 1)
	if err != nil {
		log.Println("error getting proj reqs in scan: ", err)
		log.Println("status code:", statusCode)
		// log.Println(res.Header.Get("Retry-After"))
	} else {
		totalPages = (projReqs.Meta.TotalEntries / projReqs.Meta.PerPage) + 1
	}

	log.Printf("%v: %v", currentTemplate.TemplateName, len(projReqs.Requisitions))
	// log.Printf("%v pages: %v", currentTemplate.TemplateName, totalPages)

	if totalPages <= 1 {
		if totalPages == 0 {
			log.Println("0 pages. maybe error")
		} else {
			// loop through reqs for page 1
			log.Printf("%v: scanning only page", currentTemplate.TemplateName)
			for _, projReq := range projReqs.Requisitions {
				if projReq.UpdatedAt.After(yesterday) {
					a.counter = a.counter + 1
					a.redisKeys = append(a.redisKeys, fmt.Sprintf("req:%v:time", projReq.Identifier))
					a.reqSummaries = append(
						a.reqSummaries,
						reqSummary{projReq.Identifier, projReq.CreatedAt, projReq.UpdatedAt},
					)
				}
			}

			log.Printf("%v page %v: updated since %v: %v", currentTemplate.TemplateName, 1, yesterday, len(a.redisKeys))

			if len(a.redisKeys) < 1 {
				// log.Println("no updates")
			} else {
				filterUpdates(redis, a, currentTemplate, apiClient, &msetReqs)
			}

			projReqs = models.ProjectReqs{}
			a.redisKeys = nil
			a.reqSummaries = nil
			// log.Printf("length of a keys and reqs after page scan: %v, %v", len(a.redisKeys), len(a.reqSummaries))
		}
	} else {
		log.Printf("%v: scanning page 1 of %v", currentTemplate.TemplateName, totalPages)
		for _, projReq := range projReqs.Requisitions {
			if projReq.UpdatedAt.After(yesterday) {
				a.counter = a.counter + 1
				a.redisKeys = append(a.redisKeys, fmt.Sprintf("req:%v:time", projReq.Identifier))
				a.reqSummaries = append(
					a.reqSummaries,
					reqSummary{projReq.Identifier, projReq.CreatedAt, projReq.UpdatedAt},
				)
			}
		}

		projReqs = models.ProjectReqs{}
		// log.Println("struct length after first page", len(projReqs.Requisitions))

		for pageNumber := 2; pageNumber <= totalPages; pageNumber++ {
			log.Printf("%v: scanning page %v of %v", currentTemplate.TemplateName, pageNumber, totalPages)
			_, err := services.GetProjectReqs(apiClient, currentTemplate.Id, &projReqs, pageNumber)
			if err != nil {
				fmt.Println("error getting proj reqs in scan(1): ", err)
			}
			// log.Printf("struct length during %v page: %v", pageNumber, len(projReqs.Requisitions))

			for _, projReq := range projReqs.Requisitions {
				if projReq.UpdatedAt.After(yesterday) {
					a.counter = a.counter + 1
					a.redisKeys = append(a.redisKeys, fmt.Sprintf("req:%v:time", projReq.Identifier))
					a.reqSummaries = append(
						a.reqSummaries,
						reqSummary{projReq.Identifier, projReq.CreatedAt, projReq.UpdatedAt},
					)
				}
			}

			log.Printf("%v page %v: updated since %v: %v", currentTemplate.TemplateName, pageNumber, yesterday, len(a.redisKeys))

			if len(a.redisKeys) < 1 {
				log.Println("no updates on this page")
			} else {
				filterUpdates(redis, a, currentTemplate, apiClient, &msetReqs)
			}
			projReqs = models.ProjectReqs{}
			a.redisKeys = nil
			a.reqSummaries = nil
			// log.Printf("length of a keys and reqs after page scan: %v, %v", len(a.redisKeys), len(a.reqSummaries))
		}
	}

	log.Printf("%v: total updates in template: %v", currentTemplate.TemplateName, a.counter)
	log.Printf("%v: updates needed: %v", currentTemplate.TemplateName, len(msetReqs.keys))

	// pipleine json.set commands to redis
	if len(msetReqs.keys) < 1 {
		// log.Printf("%v: no updates needed", currentTemplate.TemplateName)
	} else {
		// make a slice to store redis commands
		jsonSetCmds := make(rueidis.Commands, 0, len(msetReqs.keys))
		timeSetCmds := make(rueidis.Commands, 0, len(msetReqs.keys))
		for i := 0; i < len(msetReqs.keys); i++ {
			jsonSetCmds = append(jsonSetCmds, redis.B().JsonSet().Key(msetReqs.keys[i]).Path("$").Value(msetReqs.jsonReqs[i]).Build())
			timeSetCmds = append(timeSetCmds, redis.B().Set().Key(fmt.Sprintf("%v:time", msetReqs.keys[i])).Value(time.Now().Format(time.RFC1123)).Build())
		}

		// call DoMulti on stored commands to pipeline them
		jsonSetOkCounter := 0
		for ix, jsonSetResult := range redis.DoMulti(context.Background(), jsonSetCmds...) {
			jsr, err := jsonSetResult.ToAny()
			if err != nil {
				log.Println("pipelineResult toAny() error:", err)
			} else {
				if reflect.TypeOf(jsr).Kind() != reflect.String {
					log.Printf("json.set command didn't work: %v, %T", msetReqs.keys[ix], jsr)
					// log.Printf("type and value of response: %T: %v", pres, pres)
				} else {
					jsonSetOkCounter = jsonSetOkCounter + 1
				}
			}
		}

		timeSetOkCounter := 0
		for ix, timeSetResult := range redis.DoMulti(context.Background(), timeSetCmds...) {
			tsr, err := timeSetResult.ToAny()
			if err != nil {
				log.Println("pipelineResult toAny() error:", err)
			} else {
				if reflect.TypeOf(tsr).Kind() != reflect.String {
					log.Printf("time set command didn't work: %v, %T", msetReqs.keys[ix], tsr)
					// log.Printf("type and value of response: %T: %v", pres, pres)
				} else {
					timeSetOkCounter = timeSetOkCounter + 1
				}
			}
		}

		if jsonSetOkCounter == len(msetReqs.keys) && timeSetOkCounter == len(msetReqs.keys) {
			log.Printf("%v: all json.set and time set commands passed", currentTemplate.TemplateName)
		}
	}

	msetReqs = filteredUpdates{}
	a = updates{}
}
