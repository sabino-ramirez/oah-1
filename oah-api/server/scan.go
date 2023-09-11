package server

import (
	"fmt"
	"runtime"

	"log"
	"net/http"

	"github.com/sabino-ramirez/oah-api/models"
	"github.com/sabino-ramirez/oah-api/services"
)

func (s *Server) handleScan() http.HandlerFunc {
	log.Println("pleaseHandleScan invoked")

	var templates models.ProjectTemps

	return func(_ http.ResponseWriter, r *http.Request) {
		// ovationAPI := models.NewPleaseClient(ovationClient, 4023, r.Header.Get("babyboi"))
		ovationProdSubAPI := models.NewPleaseClient(ovationClient, 749, r.Header.Get("babyboi"))

		// _, err := services.GetProjectTemplates(ovationAPI, &templates)
		_, err := services.GetProjectTemplates(ovationProdSubAPI, &templates)
		if err != nil {
			fmt.Println("error getting proj templates", err)
		}

		// figure out how to run this in the background
		// by interval (every hour)
		// by interval with conditions (every hour from when each scan finishes)
		// constantly (as soon as each complete scan finishes, go again)
		maxJobs := make(chan struct{}, len(templates.Project_templates))
		for ix := range templates.Project_templates {
			maxJobs <- struct{}{}
			go func(projTemp models.ProjectTemp) {
				// scanForUpdates(s.cache, projTemp, ovationAPI)
				scanForUpdates(s.cache, projTemp, ovationProdSubAPI)
				<-maxJobs
			}(templates.Project_templates[ix])
		}

		log.Println("routines: ", runtime.NumGoroutine())
	}
}
