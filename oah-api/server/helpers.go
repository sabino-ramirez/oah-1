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

	response, err := apiClient.Http.Do(request)
	if err != nil {
		log.Println("request.Do error: ")
		return err
	}

	// body, _ := ioutil.ReadAll(response.Body)
	// response body showing correct json
	// log.Printf("%v", string(body))

	if err := json.NewDecoder(response.Body).Decode(target); err != nil {
		log.Printf("decoding error for %v: ", url)
		return err
	}

	defer response.Body.Close()
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

func scanForUpdates(
	redis rueidis.Client,
	currentTemplate models.ProjectTemp,
	apiClient *models.PleaseClient,
) {
	var projReqs models.ProjectReqs
	var tempReq models.BetterIndividualReq

	log.Printf("scanning template: %v\n", currentTemplate.TemplateName)

	_, err := services.GetProjectReqs(apiClient, currentTemplate.Id, &projReqs)
	if err != nil {
		fmt.Println("error getting proj reqs in scan", err)
	}

	for _, projReq := range projReqs.Requisitions {
		getLastRedisUpdateCmd := redis.B().Get().Key(fmt.Sprintf("req:%v:time", projReq.ID)).Build()
		lastRedisUpdate, err := redis.Do(context.Background(), getLastRedisUpdateCmd).ToAny()

		if rueidis.IsRedisNil(err) {
			// log.Printf("dont have this one. getting %v..", projReq.ID)
			url := fmt.Sprintf(
				"https://lab-services-sandbox.ovation.io/api/v3/project_templates/%v/requisitions/%v",
				currentTemplate.Id,
				projReq.Identifier,
			)

			// log.Println(tempReq.Requisition)
			if err := getIndividualReq(url, apiClient, &tempReq); err != nil {
				log.Printf("get individ req err: %v", err)
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

				url := fmt.Sprintf(
					"https://lab-services-sandbox.ovation.io/api/v3/project_templates/%v/requisitions/%v",
					currentTemplate.Id,
					projReq.Identifier,
				)

				if err := getIndividualReq(url, apiClient, &tempReq); err != nil {
					log.Printf("get individ req err: %v", err)
				}

				tempReqJson, err := json.Marshal(tempReq.Requisition)
				if err != nil {
					log.Println("marshalling error:", err)
				}

				if err := setNewRedisKey(redis, projReq.ID, tempReqJson); err != nil {
					log.Printf("set key in scan err: %v", err)
				}
			}
		}
		projReqs = models.ProjectReqs{}
		tempReq = models.BetterIndividualReq{}
	}
	log.Printf("scan done for template: %v\n", currentTemplate.TemplateName)
}
