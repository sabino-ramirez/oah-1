package models

import (
	// "context"
	"context"
	"log"
	"net/http"

	// "time"

	"golang.org/x/time/rate"
)

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
	RateLimiter    *rate.Limiter
}

func (c *PleaseClient) Do(req *http.Request) (*http.Response, error) {
	ctx := context.Background()
	// err := c.RateLimiter.WaitN(ctx, 5)
	err := c.RateLimiter.Wait(ctx)
	// log.Println(c.RateLimiter.Tokens())
	if err != nil {
		log.Println("limit wait err: ", err)
		return nil, err
	}

	resp, err := c.Http.Do(req)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func NewPleaseClient(
	httpClient *http.Client,
	orgId int,
	bearer string,
	rl *rate.Limiter,
) *PleaseClient {

	// rl := rate.NewLimiter(rate.Every(10*time.Second), 50)

	return &PleaseClient{
		httpClient, orgId, bearer, rl,
	}
}
