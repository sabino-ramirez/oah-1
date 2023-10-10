package server

import (
	"fmt"
	"runtime"
	// "time"

	"log"
	"net/http"

	"github.com/sabino-ramirez/oah-api/models"
	"github.com/sabino-ramirez/oah-api/services"
	"golang.org/x/time/rate"
)

func (s *Server) handleGetReqs() http.HandlerFunc {
	log.Println("pleaseHandleGetProjectReqs invoked")

	var templates models.ProjectTemps
	// var specificTemplates models.ProjectTemps

	return func(_ http.ResponseWriter, r *http.Request) {
		// rl := rate.NewLimiter(rate.Every(10*time.Second), 1)
		rl := rate.NewLimiter(3, 1) // x calls per y second
		// ovationAPI := models.NewPleaseClient(ovationClient, 4023, r.Header.Get("babyboi"))
		ovationProdSubAPI := models.NewPleaseClient(ovationClient, 749, r.Header.Get("babyboi"), rl)

		// _, err := services.GetProjectTemplates(ovationAPI, &templates)
		_, err := services.GetProjectTemplates(ovationProdSubAPI, &templates)
		if err != nil {
			fmt.Println(err)
		}

		// specificTemplates.Project_templates = append(
		// 	specificTemplates.Project_templates,
		// 	models.ProjectTemp{
		// 		Id:           1255,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation Respiratory Pathogen Panel (RPP)",
		// 	},
		// 	models.ProjectTemp{
		// 		Id:           1317,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Test Form",
		// 	},
		// 	// models.ProjectTemp{
		// 	// 	Id:           1443,
		// 	// 	ProjectName:  "Validation Infectious Disease",
		// 	// 	TemplateName: "Validation Respiratory Infectious Diseases (Reflex)",
		// 	// },
		// 	models.ProjectTemp{
		// 		Id:           1496,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation Wound",
		// 	},
		// 	models.ProjectTemp{
		// 		Id:           1517,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation UTI",
		// 	},
		// 	models.ProjectTemp{
		// 		Id:           1573,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation Covid-19 (Non-Reflex)",
		// 	},
		// 	models.ProjectTemp{
		// 		Id:           1589,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation Women's Health",
		// 	},
		// 	models.ProjectTemp{
		// 		Id:           1666,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation Pre-Barcoded CV-19",
		// 	},
		// 	models.ProjectTemp{
		// 		Id:           2111,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation FrontRunner",
		// 	},
		// 	models.ProjectTemp{
		// 		Id:           2399,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation Monkeypox",
		// 	},
		// 	models.ProjectTemp{
		// 		Id:           2705,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation  FluVID + RSV",
		// 	},
		// 	models.ProjectTemp{
		// 		Id:           2778,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation STI",
		// 	},
		// 	models.ProjectTemp{
		// 		Id:           2791,
		// 		ProjectName:  "Validation Infectious Disease",
		// 		TemplateName: "Validation GI",
		// 	},
		// )

		ftCreateCmd2 := s.cache.B().
			FtCreate().
			Index("searchTags").
			OnJson().Prefix(1).Prefix("req:").Schema().
			FieldName("$.patient.identifier").As("identifier").Tag().Separator(";").
			FieldName("$.patient.firstName").As("firstName").Tag().Separator(";").
			FieldName("$.patient.middleName").As("middleName").Tag().Separator(";").
			FieldName("$.patient.lastName").As("lastName").Tag().Separator(";").
			FieldName("$.patient.dateOfBirth").As("dob").Tag().Separator(";").
			FieldName("$.providerAccount.name").As("provAcc").Tag().Separator(";").
			Build()

		err = s.cache.Do(r.Context(), ftCreateCmd2).Error()
		if err != nil {
			log.Println("ft create error:", err)
		}

		// log.Println(len(specificTemplates.Project_templates))
		// for _, temp := range specificTemplates.Project_templates {
		// 	log.Println(temp.Id)
		// }

		// maxJobs := make(chan struct{}, len(specificTemplates.Project_templates))
		// for ix := range specificTemplates.Project_templates {
		// 	maxJobs <- struct{}{}
		// 	go func(projTemp models.ProjectTemp) {
		// 		// scanForUpdates(s.cache, projTemp, ovationAPI)
		// 		scanForUpdates(s.cache, projTemp, ovationProdSubAPI)
		// 		<-maxJobs
		// 	}(specificTemplates.Project_templates[ix])
		// }

		maxJobs := make(chan struct{}, len(templates.Project_templates))
		// comment next 2 lines for 1 time loop
		// go func() {
		// 	for {
		for ix := range templates.Project_templates {
			maxJobs <- struct{}{}
			go func(projTemp models.ProjectTemp) {
				// scanForUpdates(s.cache, projTemp, ovationAPI)
				scanForUpdates(s.cache, projTemp, ovationProdSubAPI)
				<-maxJobs
			}(templates.Project_templates[ix])
		}
		log.Println(runtime.NumGoroutine())
		// 	}
		// }()
	}
}
