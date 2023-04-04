package server

import (
	"fmt"

	"log"
	"net/http"

	"github.com/sabino-ramirez/oah-api/models"
	"github.com/sabino-ramirez/oah-api/services"
)

func (s *Server) handleGetReqs() http.HandlerFunc {
	log.Println("pleaseHandleGetProjectReqs invoked")

	var templates models.ProjectTemps

	return func(_ http.ResponseWriter, r *http.Request) {
		ovationAPI := models.NewPleaseClient(ovationClient, 4023, r.Header.Get("babyboi"))

		_, err := services.GetProjectTemplates(ovationAPI, &templates)
		if err != nil {
			fmt.Println(err)
		}

		ftCreateCmd2 := s.cache.B().
			FtCreate().
			Index("searchTags").
			OnJson().Prefix(1).Prefix("req:").Schema().
			FieldName("$.patient.identifier").As("identifier").Tag().Separator(";").
			FieldName("$.patient.firstName").As("firstName").Tag().Separator(";").
			FieldName("$.patient.lastName").As("lastName").Tag().Separator(";").
			FieldName("$.patient.dateOfBirth").As("dob").Tag().Separator(";").
			FieldName("$.providerAccount.name").As("provAcc").Tag().Separator(";").
			Build()

		err = s.cache.Do(r.Context(), ftCreateCmd2).Error()
		if err != nil {
			log.Println("ft create error:", err)
		}

		maxJobs := make(chan struct{}, len(templates.Project_templates))

		for ix := range templates.Project_templates {
			maxJobs <- struct{}{}
			go func(projTemp models.ProjectTemp) {
				scanForUpdates(s.cache, projTemp, ovationAPI)
				<-maxJobs
			}(templates.Project_templates[ix])
		}
	}
}
