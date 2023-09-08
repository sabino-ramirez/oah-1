package server

import (
	"encoding/json"
	// "io"
	// "os"

	"log"
	"net/http"

	"github.com/sabino-ramirez/oah-api/models"
	"github.com/sabino-ramirez/oah-api/services"
)

func (s *Server) handleUpdateReq() http.HandlerFunc {
	log.Println("pleaseHandleUpdateReq invoked")

	return func(w http.ResponseWriter, r *http.Request) {
		var payload models.BetterIndividualReq
		var final models.BetterIndividualReq

		// ovationAPI := models.NewPleaseClient(ovationClient, 4023, r.Header.Get("babyboi"))
		ovationProdSubAPI := models.NewPleaseClient(ovationClient, 749, r.Header.Get("babyboi"))

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

		// Happens here. the payload is correct and ovation updates lab notes
		// correctly. BUT the response comes back as "labNotes" and not "lab_notes"
		// so the models.BetterIndividualReq struct will ignore the field from the response and
		// send a null value to the front end even though it updated properly
		// have to find a way to send "lab_notes" and accept "labNotes" ridiculous.
		// status, err := services.UpdateReq(ovationAPI, payload, &final)
		status, err := services.UpdateReq(ovationProdSubAPI, payload, &final)
		if err != nil {
			log.Printf("update req error: %v", err)
			log.Printf("status: %v", status)
		}

		finalUpdateJson, err := json.Marshal(final.Requisition)
		if err != nil {
			log.Println("marshalling error:", err)
		}

		// log.Println("finalUpdateJson", string(finalUpdateJson))

		// we update the req in redis with the response from ovation
		// but the struct for reqs has "lab_notes" which is the correct key to update reqs.
		// However, the req struct ignores the update req response from ovation because
		// ovation returns a key as "labNotes".
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
