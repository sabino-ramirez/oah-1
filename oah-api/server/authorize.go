package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/sabino-ramirez/oah-api/models"
	"github.com/sabino-ramirez/oah-api/services"
	"golang.org/x/time/rate"
)

func (s *Server) handleAuthorizeToken() http.HandlerFunc {
	log.Println("handleAuthorizeToken invoked")

	return func(w http.ResponseWriter, r *http.Request) {
		rl := rate.NewLimiter(rate.Every(10*time.Second), 50)
		ovationProdSubAPI := models.NewPleaseClient(ovationClient, 749, r.Header.Get("babyboi"), rl)

		status_code, _ := services.GetProjectTemplates(ovationProdSubAPI, nil)
		if status_code != 200 {
			fmt.Println("status code not 200")
		}

		w.Header().Set("Content-Type", "application/json")

		type statusCode struct {
			Code int `json:"code"`
		}

		if err := json.NewEncoder(w).Encode(&statusCode{Code: status_code}); err != nil {
			log.Println("encoding error")
		}
	}
}
