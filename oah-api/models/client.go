package models

import "net/http"

// type Client struct {
// 	Http              *http.Client
// 	OrganizationId    int
// 	ProjectTemplateId int
// 	Bearer            string
// }
//
// func NewClient(httpClient *http.Client, orgId int, projTemplateId int, bearer string) *Client {
// 	return &Client{
// 		httpClient, orgId, projTemplateId, bearer,
// 	}
// }

type PleaseClient struct {
	Http           *http.Client
	OrganizationId int
	Bearer         string
}

func NewPleaseClient(httpClient *http.Client, orgId int, bearer string) *PleaseClient {
	return &PleaseClient{
		httpClient, orgId, bearer,
	}
}
