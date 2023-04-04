package services

import (
	"bytes"
	"encoding/json"
	"fmt"

	"log"
	"net/http"

	"github.com/sabino-ramirez/oah-api/models"
)

func GetProjectTemplates(client *models.PleaseClient, target interface{}) (int, error) {
	// url := fmt.Sprintf("https://lab-services.ovation.io/api/v3/project_templates/%d/requisitions?startDate=01-01-2022&endDate=01-04-2022", client.ProjectTemplateId)
	url := fmt.Sprintf(
		"https://lab-services-sandbox.ovation.io/api/v3/project_templates?organizationId=%d",
		client.OrganizationId,
	)
	// url := fmt.Sprintf("https://lab-services.ovation.io/api/v3/project_templates?organizationId=%d", client.OrganizationId)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println("new req error:", err)
	}

	req.Header.Add("Authorization", client.Bearer)

	res, err := client.Http.Do(req)
	if err != nil {
		log.Println("response error:", err)
	}

	// use this to see raw data in case
	// we don't know what it looks like
	// before marshalling

	// io.Copy(os.Stdout, res.Body)

	defer res.Body.Close()

	return res.StatusCode, json.NewDecoder(res.Body).Decode(target)
}

func GetProjectReqs(
	client *models.PleaseClient,
	projectTemplateId any,
	target interface{},
) (int, error) {
	url := fmt.Sprintf(
		"https://lab-services-sandbox.ovation.io/api/v3/project_templates/%v/requisitions",
		projectTemplateId,
	)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println("please getProjReqs request error:", err)
	}

	req.Header.Add("Authorization", client.Bearer)

	res, err := client.Http.Do(req)
	if err != nil {
		log.Println("response error:", err)
	}

	// io.Copy(os.Stdout, res.Body)

	defer res.Body.Close()

	// decode takes json and stores it in the target interface
	return res.StatusCode, json.NewDecoder(res.Body).Decode(target)
}

func UpdateReq(
	client *models.PleaseClient,
	updatedReq models.BetterIndividualReq,
	target interface{},
) (int, error) {
	// log.Printf("%v, %v\n", updatedReq.Requisition.ProjectTemplateID, updatedReq.Requisition.Identifier)
	url := fmt.Sprintf(
		"https://lab-services-sandbox.ovation.io/api/v3/project_templates/%d/requisitions/%s",
		updatedReq.Requisition.ProjectTemplateID,
		updatedReq.Requisition.Identifier,
	)

	updatedReqJson, err := json.Marshal(updatedReq)
	if err != nil {
		log.Println("marshal error in update req:", err)
	}
	log.Printf("updatedReqJson: \n%v", string(updatedReqJson))

	request, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(updatedReqJson))
	if err != nil {
		log.Println("new request error:", err)
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Add("Authorization", client.Bearer)

	response, err := client.Http.Do(request)
	if err != nil {
		log.Println("response error:", err)
	}

	// show response from ovation endpoint
	// io.Copy(os.Stdout, res.Body)

	defer response.Body.Close()

	// json.NewDecoder returning error because we're getting 404 page html which is invalid
	return response.StatusCode, json.NewDecoder(response.Body).Decode(target)
	// return 0, nil
}
