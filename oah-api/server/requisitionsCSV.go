package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gocarina/gocsv"
	"github.com/rueian/rueidis"
	"github.com/sabino-ramirez/oah-api/models"
)

func (s *Server) handleGetReqsCSV() http.HandlerFunc {
	// Read the CSV file into a slice of Record structs

	log.Println("pleaseHandleGetProjectReqsCSV invoked")

	// var templates models.ProjectTemps
	// var specificTemplates models.ProjectTemps

	return func(_ http.ResponseWriter, r *http.Request) {
		ftCreateCmd2 := s.cache.B().
			FtCreate().
			Index("searchTags").
			OnJson().Prefix(1).Prefix("req:").Schema().
			FieldName("$.identifier").As("identifier").Tag().Separator(";").
			FieldName("$.patientFirstName").As("firstName").Tag().Separator(";").
			FieldName("$.patientMiddleName").As("middleName").Tag().Separator(";").
			FieldName("$.patientLastName").As("lastName").Tag().Separator(";").
			FieldName("$.patientDateOfBirth").As("dob").Tag().Separator(";").
			FieldName("$.providerName").As("provAcc").Tag().Separator(";").
			Build()

		err := s.cache.Do(r.Context(), ftCreateCmd2).Error()
		if err != nil {
			log.Println("ft create error:", err)
		}

		// filepath.WalkDir("./lab note reqs/", func(path string, d fs.DirEntry, err error) error {
		// 	if err != nil {
		// 		return err
		// 	}
		//
		// 	if !d.IsDir() {
		// 		p := fmt.Sprintf("./%v", path)
		// 		f, err := os.Open(p)
		// 		if err != nil {
		// 			log.Println(err)
		// 		}
		//
		// 		defer f.Close()
		//
		// 		if err := gocsv.UnmarshalFile(f, &reqs); err != nil {
		// 			panic(err)
		// 		}
		// 	}
		//
		// 	return nil
		// })

		// var reqs []models.CsvReq
		reqs := []*models.CsvReq{}

		// GOCSV version
		file, err := os.Open("req_reports/01.csv")
		// file, err := os.Open("req_reports/02.csv")
		// file, err := os.Open("req_reports/03.csv")
		if err != nil {
			log.Fatal(err)
		}
		defer file.Close()

		if err := gocsv.UnmarshalFile(file, &reqs); err != nil {
			log.Panic(err)
		}

		// // csvutil version

		// i, _ := json.MarshalIndent(reqs[46], "", "\t")
		// log.Println(string(i))

		println(len(reqs))

		for _, req := range reqs {
			reqJson, err := json.Marshal(req)
			if err != nil {
				log.Println("marshalling error:", err)
			}

			if err := addRowToRedis(s.cache, req.Identifier, reqJson); err != nil {
				log.Printf("set redis key err: %v", err)
			}
		}

		// // Print the records
		// for _, req := range reqs {
		// 	log.Printf("Identifier: %s\n", req.Identifier)
		// }
	}
}

func addRowToRedis(r rueidis.Client, identifier string, reqJson []byte) error {
	// log.Println(string(reqJson))
	setReqCmd := r.B().
		JsonSet().
		Key(fmt.Sprintf("req:%v", identifier)).
		Path("$").
		Value(fmt.Sprintf("%v", string(reqJson))).
		Build()

	if err := r.Do(context.Background(), setReqCmd).Error(); err != nil {
		return err
	}

	setTimeCmd := r.B().
		Set().
		Key(fmt.Sprintf("req:%v:time", identifier)).
		Value(fmt.Sprintf("%v", time.Now().Format(time.RFC1123))).Build()

	if err := r.Do(context.Background(), setTimeCmd).Error(); err != nil {
		return err
	}

	return nil
}
