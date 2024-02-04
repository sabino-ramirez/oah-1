package server

import (
	"fmt"
	"runtime"
	"strings"

	// "time"

	"log"
	"net/http"

	"github.com/sabino-ramirez/oah-api/models"
	"github.com/sabino-ramirez/oah-api/services"
	// "golang.org/x/time/rate"
)

func (s *Server) handleScanCSV() http.HandlerFunc {
	log.Println("pleaseHandleScan invoked")

	var templates models.ProjectTemps

	// rl := rate.NewLimiter(rate.Every(10*time.Second), 50)

	return func(_ http.ResponseWriter, r *http.Request) {
		// ovationAPI := models.NewPleaseClient(ovationClient, 4023, r.Header.Get("babyboi"))
		ovationProdSubAPI := models.NewPleaseClient(ovationClient, 749, r.Header.Get("babyboi"))

		// _, err := services.GetProjectTemplates(ovationAPI, &templates)
		_, err := services.GetProjectTemplates(ovationProdSubAPI, &templates)
		if err != nil {
			fmt.Println("error getting proj templates", err)
		}

		// figure out how to run this automatically
		// by interval (once per hour/day)
		// by interval with conditions (every hour from when each scan finishes)
		maxJobs := make(chan struct{}, len(templates.Project_templates))
		for ix, proj_template := range templates.Project_templates {
			if strings.Contains(proj_template.TemplateName, "Validation") {
				// if !strings.Contains(proj_template.ProjectName, "Validation") &&
				// 	strings.Contains(proj_template.TemplateName, "Pre-Barcoded CV-19") {
				maxJobs <- struct{}{}
				go func(projTemp models.ProjectTemp) {
					// scanForUpdates(s.cache, projTemp, ovationAPI)
					scanForUpdates(s.cache, projTemp, ovationProdSubAPI)
					// log.Println(projTemp.TemplateName)
					<-maxJobs
				}(templates.Project_templates[ix])
			} else {
				log.Printf("not validation %v, %v", proj_template.TemplateName, proj_template.Id)
				// log.Printf("not Pre-Barcoded CV-19: %v %v", proj_template.TemplateName, proj_template.Id)
			}
		}

		log.Println("routines: ", runtime.NumGoroutine())
	}
}
