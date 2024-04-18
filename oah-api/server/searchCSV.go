package server

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"log"
	"net/http"

	"github.com/sabino-ramirez/oah-api/models"
)

func escaper(val string) string {
	// return strings.ReplaceAll(strings.ReplaceAll(val, "[", "\\["), "-", "\\-")
	// return strings.ReplaceAll(strings.ReplaceAll(val, ".", "\\."), " ", "\\\\\\ ")
	return strings.ReplaceAll(strings.ReplaceAll(strings.ReplaceAll(
		strings.ReplaceAll(
			strings.ReplaceAll(strings.ReplaceAll(val, ".", "\\."), "-", "\\-"),
			"'",
			"\\'",
		), "(", "\\("), ")", "\\)"),
		" ",
		"\\\\\\ ",
	)
}

func (s *Server) handleSearchCSV() http.HandlerFunc {
	log.Println("pleaseHandleSearchCSV invoked")

	return func(w http.ResponseWriter, r *http.Request) {
		var tempReq models.CsvReq
		var tempReqList models.CsvReqs

		// parse form to get query params from front end
		if err := r.ParseForm(); err != nil {
			log.Println("request form parse error")
		}

		log.Println("form: ", r.Form)

		checkQueryFieldsTags := func() string {
			var b strings.Builder

			if r.Form.Has("identifier") {
				identifier := r.Form["identifier"][0]

				if _, err := fmt.Fprintf(&b, "@identifier:{%v*}", escaper(identifier)); err != nil {
					log.Println("string builder error for identifier", err)
				}
			}

			if r.Form.Has("firstName") {
				firstName := r.Form["firstName"][0]
				if _, err := fmt.Fprintf(&b, " @firstName:{%v*}", escaper(firstName)); err != nil {
					log.Println("string builder error for firstName", err)
				}
			}

			if r.Form.Has("lastName") {
				lastName := r.Form["lastName"][0]
				if _, err := fmt.Fprintf(&b, " @lastName:{%v*}", escaper(lastName)); err != nil {
					log.Println("string builder error for lastName", err)
				}
			}

			if r.Form.Has("middleName") {
				middleName := r.Form["middleName"][0]
				if _, err := fmt.Fprintf(&b, " @middleName:{%v*}", escaper(middleName)); err != nil {
					log.Println("string builder error for middleName", err)
				}
			}

			if r.Form.Has("dob") {
				dob := r.Form["dob"][0]
				if _, err := fmt.Fprintf(&b, " @dob:{%v*}", escaper(dob)); err != nil {
					log.Println("string builder error for dob", err)
				}
			}

			if r.Form.Has("provAcc") {
				provAcc := r.Form["provAcc"][0]
				if _, err := fmt.Fprintf(&b, " @provAcc:{%v*}", escaper(provAcc)); err != nil {
					log.Println("string builder error for provAcc", err)
				}
			}

			return b.String()
		}
		log.Println("checkQueryFieldsTags():", checkQueryFieldsTags())

		ftSearchCmd := s.cache.B().
			FtSearch().
			Index("searchTags").
			Query(checkQueryFieldsTags()).
			Limit().
			OffsetNum(0, 1000).
			Build()

		ftSearchResult, err := s.cache.Do(r.Context(), ftSearchCmd).ToAny()
		if err != nil {
			log.Println("ft search error:", err)
		}

		log.Printf("search result type: %T\n", ftSearchResult)
		// redis 6.2.10: []interface {}
		// redis 7.2.0: map[string]interface {}
		// redis 7.2.0: map[attributes:[] error:[] format:STRING results:[] total_results:0]

		// log.Printf("results:\n %v", result)

		total_results, err := strconv.Atoi(
			fmt.Sprintf("%v", ftSearchResult.(map[string]interface{})["total_results"]),
		)
		if err != nil {
			log.Printf("error converting total results to int")
		}
		log.Printf("results amount %v\n\n", total_results)

		resultsArray := ftSearchResult.(map[string]interface{})["results"].([]interface{})

		// log.Printf(
		// 	"results field type: %T\nresults field:\n%v\n", // []interface{}
		// 	result.(map[string]interface{})["results"],
		// 	result.(map[string]interface{})["results"],
		// )

		// log.Printf(
		// 	"first result type and value: %T\n%v\n",
		// 	result.(map[string]interface{})["results"].([]interface{})[0], // map[string]interface{}
		// 	result.(map[string]interface{})["results"].([]interface{})[0],
		// )

		// // map[string]interface{}
		// log.Printf(
		// 	"first result first key: %T\n%v\n",
		// 	result.(map[string]interface{})["results"].([]interface{})[0].(map[string]interface{})["extra_attributes"].(map[string]interface{})["$"],
		// 	result.(map[string]interface{})["results"].([]interface{})[0].(map[string]interface{})["extra_attributes"].(map[string]interface{})["$"],
		// )

		if total_results > 0 {
			for _, resultReq := range resultsArray {
				resultReqJson := fmt.Sprintf(
					`%v`,
					resultReq.(map[string]interface{})["extra_attributes"].(map[string]interface{})["$"],
				)

				if err := json.Unmarshal([]byte(resultReqJson), &tempReq); err != nil {
					log.Println("unmarshal error", err)
				}

				tempReqList.Reqs = append(tempReqList.Reqs, tempReq)
				tempReq = models.CsvReq{}
			}
		}

		// for _, req := range tempReqList.Reqs {
		// 	log.Println(req.Identifier)
		// }

		// for i := 2; i <= iterator*2; i += 2 {
		// 	searchResultJson := fmt.Sprintf(
		// 		`%v`,
		// 		result.([]interface{})[i].([]interface{})[1],
		// 	)
		//
		// 	if err := json.Unmarshal([]byte(searchResultJson), &tempReq); err != nil {
		// 		log.Println("unmarshal error", err)
		// 	}
		//
		// 	tempReqList.Reqs = append(tempReqList.Reqs, tempReq)
		// 	tempReq = models.CsvReq{}
		// }
		//
		w.Header().Set("Content-Type", "application/json")

		if err := json.NewEncoder(w).Encode(tempReqList); err != nil {
			log.Println("encoding error")
		}

		tempReqList = models.CsvReqs{}
	}
}
