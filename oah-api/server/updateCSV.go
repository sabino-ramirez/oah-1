package server

import (
	"encoding/json"

	"log"
	"net/http"
	// "time"

	"github.com/sabino-ramirez/oah-api/models"
	"github.com/sabino-ramirez/oah-api/services"
	"golang.org/x/time/rate"
)

func (s *Server) handleUpdateReqCSV(limiter *rate.Limiter) http.HandlerFunc {
	log.Println("pleaseHandleUpdateReq invoked")

	return func(w http.ResponseWriter, r *http.Request) {
		var payload models.BetterIndividualReq
		// var final models.BetterIndividualReq
		var jsonToCsv models.JsonToCsvReq

		// ovationAPI := models.NewPleaseClient(ovationClient, 4023, r.Header.Get("babyboi"))
		ovationProdSubAPI := models.NewPleaseClient(
			ovationClient,
			749,
			r.Header.Get("babyboi"),
			limiter,
		)

		// io.Copy(os.Stdout, r.Body)

		// decode payload to req struct to send as struct to helper func
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			log.Printf("error decoding payload in /update: %v", err)
		}

		statusCode, errorMap, err := services.UpdateReqCSV(ovationProdSubAPI, payload, &jsonToCsv)
		if err != nil {
			log.Printf("update req error: %v", err)
		} else if statusCode != 200 {
			log.Println("update response code:", statusCode)
			log.Println(errorMap)

			w.WriteHeader(statusCode)

			errorMap["identifier"] = payload.Requisition.Identifier

			errorMsgJson, err := json.Marshal(errorMap)
			if err != nil {
				log.Println("error marshalling error msg:", err)
			}

			if _, err := w.Write(errorMsgJson); err != nil {
				log.Println("error writing json in /update:", err)
			}

			return
		} else {
			// log.Println("primdob right before marshal", jsonToCsv.PrimDobOfInsured)
			// log.Println("dob right before marshal", jsonToCsv.PatientDateOfBirth)
			// back to json for entering into redis
			jsonToCsvJson, err := json.Marshal(jsonToCsv)
			if err != nil {
				log.Println("marshalling error:", err)
			}
			log.Println("jsonToCSVJson:\n", string(jsonToCsvJson))

			if err := addRowToRedis(s.cache, jsonToCsv.Identifier, jsonToCsvJson); err != nil {
				log.Printf("setting new key in /updated error: %v", err)
			}

			if err := json.NewEncoder(w).Encode(jsonToCsv); err != nil {
				log.Println("error encoding updated req json: ", err)
			}
		}

		payload = models.BetterIndividualReq{}
		jsonToCsv = models.JsonToCsvReq{}
		// final = models.BetterIndividualReq{}
	}
}
