package server

import (
	"context"
	"encoding/json"
	"fmt"

	"log"
	"time"

	"net/http"

	"github.com/rueian/rueidis"
	"github.com/sabino-ramirez/oah-api/models"
	"github.com/sabino-ramirez/oah-api/services"
)

func getIndividualReq(url string, apiClient *models.PleaseClient, target interface{}) error {

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println("new request error: ")
		return err
	}

	request.Header.Add("Authorization", apiClient.Bearer)

	// response, err := apiClient.Http.Do(request)
	response, err := apiClient.Do(request)
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

func setNewRedisKey(r rueidis.Client, id int, reqJson []byte) error {

	// log.Println(string(reqJson))
	setReqCmd := r.B().
		JsonSet().
		Key(fmt.Sprintf("req:%v", id)).
		Path("$").
		Value(fmt.Sprintf("%v", string(reqJson))).
		Build()

	if err := r.Do(context.Background(), setReqCmd).Error(); err != nil {
		return err
	}

	setTimeCmd := r.B().
		Set().
		Key(fmt.Sprintf("req:%v:time", id)).
		Value(fmt.Sprintf("%v", time.Now().Format(time.RFC1123))).Build()

	if err := r.Do(context.Background(), setTimeCmd).Error(); err != nil {
		return err
	}

	return nil
}

// 5 params??? this is my life now
func ProcessReqs(
	redis rueidis.Client,
	currentTemplate models.ProjectTemp,
	apiClient *models.PleaseClient,
	projReq models.ProjectReq,
	tempReq models.BetterIndividualReq,
) {

	getLastRedisUpdateCmd := redis.B().
		Get().
		Key(fmt.Sprintf("req:%v:time", projReq.ID)).
		Build()
	lastRedisUpdate, err := redis.Do(context.Background(), getLastRedisUpdateCmd).ToAny()

	if rueidis.IsRedisNil(err) {
		// log.Printf("dont have this one. getting %v..", projReq.ID)
		// url := fmt.Sprintf(
		// 	"https://lab-services-sandbox.ovation.io/api/v3/project_templates/%v/requisitions/%v",
		// 	currentTemplate.Id,
		// 	projReq.Identifier,
		// )

		prodSubUrl := fmt.Sprintf(
			"https://lab-services.ovation.io/api/v3/project_templates/%v/requisitions/%v",
			currentTemplate.Id,
			projReq.Identifier,
		)

		// if err := getIndividualReq(url, apiClient, &tempReq); err != nil {
		if err := getIndividualReq(prodSubUrl, apiClient, &tempReq); err != nil {
			log.Printf("get individ req err: %#v", err)
		}

		tempReqJson, err := json.Marshal(tempReq.Requisition)
		if err != nil {
			log.Println("marshalling error:", err)
		}
		// log.Println(string(tempReqJson))

		if err := setNewRedisKey(redis, projReq.ID, tempReqJson); err != nil {
			log.Printf("set redis key err: %v", err)
		}

	} else if err != nil {
		log.Printf("getting last update time err: %v", err)

	} else {
		// log.Println("we have this one already")
		lastRedisUpdateTimeObj, _ := time.Parse(time.RFC1123, fmt.Sprintf("%v", lastRedisUpdate))
		// log.Println("redis time: ", lastRedisUpdateTimeObj)
		// log.Println("ovation time: ", projReq.UpdatedAt)

		if projReq.UpdatedAt.After(lastRedisUpdateTimeObj) {
			log.Printf(
				"%v reqUpdatedAt: %v \n redisUpdatedAt: %v",
				projReq.Identifier,
				projReq.UpdatedAt,
				lastRedisUpdateTimeObj,
			)

			// url := fmt.Sprintf(
			// 	"https://lab-services-sandbox.ovation.io/api/v3/project_templates/%v/requisitions/%v",
			// 	currentTemplate.Id,
			// 	projReq.Identifier,
			// )

			prodSubUrl := fmt.Sprintf(
				"https://lab-services.ovation.io/api/v3/project_templates/%v/requisitions/%v",
				currentTemplate.Id,
				projReq.Identifier,
			)

			// if err := getIndividualReq(url, apiClient, &tempReq); err != nil {
			// 	log.Printf("get individ req err: %v", err)
			// }

			if err := getIndividualReq(prodSubUrl, apiClient, &tempReq); err != nil {
				log.Printf("get individ req err: %v", err)
			}

			tempReqJson, err := json.Marshal(tempReq.Requisition)
			if err != nil {
				log.Println("marshalling error:", err)
			}

			// log.Println(string(tempReqJson))

			if err := setNewRedisKey(redis, projReq.ID, tempReqJson); err != nil {
				log.Printf("set key in scan err: %v", err)
			}

			log.Println("updated in redis")
		}
	}
}

func scanForUpdates(
	redis rueidis.Client,
	currentTemplate models.ProjectTemp,
	apiClient *models.PleaseClient,
) {
	var projReqs models.ProjectReqs
	var tempReq models.BetterIndividualReq

	var totalPages int

	statusCode, err := services.GetProjectReqs(apiClient, currentTemplate.Id, &projReqs, 1)
	if err != nil {
		log.Println("error getting proj reqs in scan: ", err)
		log.Println("status code:", statusCode)
		// log.Println(res.Header.Get("Retry-After"))
		// totalPages = 1
	} else {
		totalPages = (projReqs.Meta.TotalEntries / projReqs.Meta.PerPage) + 1
	}

	if totalPages <= 1 {
		// log.Printf(
		// 	"scanning page %v of %v for %v\n",
		// 	projReqs.Meta.CurrentPage,
		// 	totalPages,
		// 	currentTemplate.TemplateName,
		// )

		// loop through reqs for page 1
		for _, projReq := range projReqs.Requisitions {
			ProcessReqs(redis, currentTemplate, apiClient, projReq, tempReq)
			// projReqs = models.ProjectReqs{}
			tempReq = models.BetterIndividualReq{}
		}

		log.Printf(
			"scan done for page %v of %v for %v\n",
			projReqs.Meta.CurrentPage,
			totalPages,
			currentTemplate.TemplateName,
		)
	} else { // end of if pages <= 1
		// loop through reqs for page 1
		for _, projReq := range projReqs.Requisitions {
			ProcessReqs(redis, currentTemplate, apiClient, projReq, tempReq)
			// projReqs = models.ProjectReqs{}
			tempReq = models.BetterIndividualReq{}
		}

		// repeat the process for all remaining pages starting w page 2
		for pageNumber := 2; pageNumber <= totalPages; pageNumber++ {
			_, err := services.GetProjectReqs(apiClient, currentTemplate.Id, &projReqs, pageNumber)
			if err != nil {
				fmt.Println("error getting proj reqs in scan(1): ", err)
			}

			// log.Printf(
			// 	"scanning page %v of %v for %v\n",
			// 	projReqs.Meta.CurrentPage,
			// 	totalPages,
			// 	currentTemplate.TemplateName,
			// )

			// loop through reqs for current page
			for _, projReq := range projReqs.Requisitions {
				ProcessReqs(redis, currentTemplate, apiClient, projReq, tempReq)
				// projReqs = models.ProjectReqs{}
				tempReq = models.BetterIndividualReq{}
			}

			log.Printf(
				"scan done for page %v of template: %v\n",
				projReqs.Meta.CurrentPage,
				currentTemplate.TemplateName,
			)
		} // end of for loop for pages
	} // end of else statement
}
