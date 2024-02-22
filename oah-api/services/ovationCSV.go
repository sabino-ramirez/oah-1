package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	// "io"
	// "os"

	"log"
	"net/http"

	"github.com/sabino-ramirez/oah-api/models"
)

// func GetProjectTemplatesCSV(client *models.PleaseClient, target interface{}) (int, error) {
// 	// url := fmt.Sprintf(
// 	// 	"https://lab-services-sandbox.ovation.io/api/v3/project_templates?organizationId=%d",
// 	// 	client.OrganizationId,
// 	// )
//
// 	prodSubUrl := fmt.Sprintf(
// 		"https://lab-services.ovation.io/api/v3/project_templates?organizationId=%d",
// 		client.OrganizationId,
// 	)
//
// 	// req, err := http.NewRequest("GET", url, nil)
// 	req, err := http.NewRequest("GET", prodSubUrl, nil)
// 	if err != nil {
// 		log.Println("new request error:", err)
// 	}
//
// 	req.Header.Add("Authorization", client.Bearer)
//
// 	// res, err := client.Http.Do(req)
// 	res, err := client.Do(req)
// 	if err != nil {
// 		log.Println("response error:", err)
// 	}
//
// 	// use this to see raw data in case
// 	// we don't know what it looks like
// 	// before marshalling
//
// 	// io.Copy(os.Stdout, res.Body)
//
// 	defer res.Body.Close()
//
// 	return res.StatusCode, json.NewDecoder(res.Body).Decode(target)
// }

// func GetProjectReqsCSV(
// 	client *models.PleaseClient,
// 	projectTemplateId any,
// 	target interface{},
// 	pageNumber int,
// ) (int, error) {
// 	// url := fmt.Sprintf(
// 	// 	"https://lab-services-sandbox.ovation.io/api/v3/project_templates/%v/requisitions",
// 	// 	projectTemplateId,
// 	// )
//
// 	prodSubUrl := fmt.Sprintf(
// 		"https://lab-services.ovation.io/api/v3/project_templates/%v/requisitions?page=%v",
// 		projectTemplateId,
// 		pageNumber,
// 	)
//
// 	// req, err := http.NewRequest("GET", url, nil)
// 	req, err := http.NewRequest("GET", prodSubUrl, nil)
// 	if err != nil {
// 		log.Println("please getProjReqs request error:", err)
// 	}
//
// 	req.Header.Add("Authorization", client.Bearer)
//
// 	// res, err := client.Http.Do(req)
// 	res, err := client.Do(req)
// 	if err != nil {
// 		log.Println("response error:", err)
// 		// log.Println(res.Header.Get("Retry-After"))
// 	}
// 	if res.StatusCode == 429 {
// 		log.Println(res.Header.Get("Retry-After"))
// 	}
//
// 	// io.Copy(os.Stdout, res.Body)
//
// 	defer res.Body.Close()
//
// 	// decode takes json and stores it in the target interface
// 	return res.StatusCode, json.NewDecoder(res.Body).Decode(target)
// }

func UpdateReqCSV(
	client *models.PleaseClient,
	updatedReq models.BetterIndividualReq,
	target interface{},
) (int, map[string]any, error) {
	// log.Printf("%v, %v\n", updatedReq.Requisition.ProjectTemplateID, updatedReq.Requisition.Identifier)
	// url := fmt.Sprintf(
	// 	"https://lab-services-sandbox.ovation.io/api/v3/project_templates/%d/requisitions/%s",
	// 	updatedReq.Requisition.ProjectTemplateID,
	// 	updatedReq.Requisition.Identifier,
	// )

	// var message string
	var errorResponse models.ErrorResponse

	prodSubUrl := fmt.Sprintf(
		"https://lab-services.ovation.io/api/v3/project_templates/%d/requisitions/%s",
		// updatedReq.Requisition.ProjectTemplateID,
		1443,
		updatedReq.Requisition.Identifier,
	)

	updatedReqJson, err := json.Marshal(updatedReq)
	if err != nil {
		log.Println("marshal error in update req:", err)
	}
	// log.Printf("updatedReqJson: \n%v", string(updatedReqJson))

	// request, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(updatedReqJson))
	request, err := http.NewRequest(http.MethodPut, prodSubUrl, bytes.NewBuffer(updatedReqJson))
	if err != nil {
		log.Println("new request error:", err)
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Add("Authorization", client.Bearer)

	// response, err := client.Http.Do(request)
	response, err := client.Do(request)
	if err != nil {
		log.Println("response error:", err)
	} else if response.StatusCode != 200 {
		if err := json.NewDecoder(response.Body).Decode(&errorResponse); err != nil {
			log.Println("couldn't decode into errorResponse:", err)
			return 0, nil, err
		}
		// message = fmt.Sprintf("ovation error msg: %v", errorResponse)
		return response.StatusCode, errorResponse.Errors, nil
	}

	// show response from ovation endpoint
	// io.Copy(os.Stdout, response.Body)

	defer response.Body.Close()

	// json.NewDecoder returning error because we're getting 404 page html which is
	// not valid json
	return response.StatusCode, nil, json.NewDecoder(response.Body).Decode(target)
	// return 0, nil
}
