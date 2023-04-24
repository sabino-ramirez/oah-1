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
	return strings.ReplaceAll(strings.ReplaceAll(val, "[", "\\["), "-", "\\-")
}

func (s *Server) handleSearch() http.HandlerFunc {
	log.Println("pleaseHandleSearch invoked")

	var tempReq models.BetterIndividualReq
	var tempList models.BetterIndividualReqs

	return func(w http.ResponseWriter, r *http.Request) {
		// pathParams := mux.Vars(r)
		// queryParams := r.URL.Query()

		// parse form to get query params from front end
		if err := r.ParseForm(); err != nil {
			log.Println("request form parse error")
		}

		log.Println("form: ", r.Form)

		checkQueryFieldsTags := func() string {
			var b strings.Builder

			if r.Form.Has("identifier") {
				identifier := r.Form["identifier"][0]
				// log.Println(identifier)
				// if _, err := fmt.Fprintf(&b, "%v*", identifier); err != nil {
				// 	log.Println("string builder error for identifier", err)
				// }

				if _, err := fmt.Fprintf(&b, "@identifier:{%v*}", escaper(identifier)); err != nil {
					log.Println("string builder error for identifier", err)
				}
			}

			if r.Form.Has("firstName") {
				firstName := r.Form["firstName"][0]
				// log.Println("first", firstName)
				if _, err := fmt.Fprintf(&b, " @firstName:{%v*}", escaper(firstName)); err != nil {
					log.Println("string builder error for firstName", err)
				}
			}

			if r.Form.Has("lastName") {
				lastName := r.Form["lastName"][0]
				// log.Println("last", lastName)
				if _, err := fmt.Fprintf(&b, " @lastName:{%v*}", escaper(lastName)); err != nil {
					log.Println("string builder error for lastName", err)
				}
			}

			if r.Form.Has("dob") {
				dob := r.Form["dob"][0]
				// log.Println("last", lastName)
				if _, err := fmt.Fprintf(&b, " @dob:{%v*}", escaper(dob)); err != nil {
					log.Println("string builder error for dob", err)
				}
			}

			if r.Form.Has("provAcc") {
				provAcc := r.Form["provAcc"][0]
				// log.Println("last", lastName)
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
			// Query(fmt.Sprintf("@firstName:(%v*)", queryString)).
			// Query("@lastName:(alor*)").
			Limit().
			OffsetNum(0, 700).
			Build()

		result, err := s.cache.Do(r.Context(), ftSearchCmd).ToAny()
		if err != nil {
			log.Println("ft search error:", err)
		}

		iterator, err := strconv.Atoi(fmt.Sprintf("%v", result.([]interface{})[0]))
		if err != nil {
			log.Printf("error converting amount to int")
		}

		log.Printf("results amount %v\n\n", iterator)

		for i := 2; i <= iterator*2; i += 2 {
			searchResultJson := fmt.Sprintf(
				`{"requisition": %v}`,
				result.([]interface{})[i].([]interface{})[1],
			)

			if err := json.Unmarshal([]byte(searchResultJson), &tempReq); err != nil {
				log.Println("unmarshal error")
			}

			tempList.Requisitions = append(tempList.Requisitions, tempReq)

			tempReq = models.BetterIndividualReq{}
		}

		w.Header().Set("Content-Type", "application/json")

		if err := json.NewEncoder(w).Encode(tempList); err != nil {
			log.Println("encoding error")
		}

		tempList = models.BetterIndividualReqs{}
	}
}
