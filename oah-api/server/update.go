package server

import (
	"encoding/json"

	"log"
	"net/http"

	"github.com/sabino-ramirez/oah-api/models"
	"github.com/sabino-ramirez/oah-api/services"
)

func (s *Server) handleUpdateReq() http.HandlerFunc {
	log.Println("pleaseHandleUpdateReq invoked")

	var payload models.BetterIndividualReq
	var final models.BetterIndividualReq

	return func(w http.ResponseWriter, r *http.Request) {
		ovationAPI := models.NewPleaseClient(ovationClient, 4023, r.Header.Get("babyboi"))

		// io.Copy(os.Stdout, r.Body)

		// decode payload to req struct to send as struct to helper func
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			log.Printf("error decoding payload in /update: %v", err)
		}

		// payloadJson, err := json.Marshal(payload)
		// if err != nil {
		// 	log.Println("marshalling error:", err)
		// }
		// log.Printf("payloadJson: %v", string(payloadJson))

		status, err := services.UpdateReq(ovationAPI, payload, &final)
		if err != nil {
			log.Printf("update req error: %v", err)
			log.Printf("status: %v", status)
		}

		finalUpdateJson, err := json.Marshal(final.Requisition)
		if err != nil {
			log.Println("marshalling error:", err)
		}

		// log.Println("finalUpdateJson", string(finalUpdateJson))

		if err := setNewRedisKey(s.cache, final.Requisition.ID, finalUpdateJson); err != nil {
			log.Printf("setting new key in /updated error: %v", err)
		}

		if err := json.NewEncoder(w).Encode(final); err != nil {
			log.Println("error encoding updated req json: ", err)
		}

		payload = models.BetterIndividualReq{}
		final = models.BetterIndividualReq{}
	}
}
