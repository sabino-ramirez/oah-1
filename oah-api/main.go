// curl "http://localhost:8000/api?q=los%20angeles" -v | jq
package main

import (
	// "context"
	"fmt"
	"log"
	"net/http"
	"os"
	// "strings"

	"github.com/rs/cors"
	"github.com/sabino-ramirez/oah-api/server"
)

func main() {
	// for _, e := range os.Environ() {
	// 	pair := strings.SplitN(e, "=", 2)
	// 	fmt.Printf("%s\n", pair[0])
	// }

	// fmt.Println(os.LookupEnv("SERVER_ADDRESS"))
	// fmt.Println(os.LookupEnv("CLIENT_LOCATION"))
	fmt.Println(os.LookupEnv("REDIS_HOST"))
	fmt.Println(os.LookupEnv("REDIS_PASSWORD"))

	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
	}

}

func run() error {
	srv := server.NewServer()

	// srv2 := server.NewRedisClient()
	// setcmd := srv2.Rclient.B().Set().Key("dad").Value("yay").Build()
	// srv2.Rclient.Do(context.Background(), setcmd)

	c := cors.New(cors.Options{
		// AllowedOrigins: []string{"http://localhost:3000"},
		AllowedOrigins: []string{"*"},
		AllowedHeaders: []string{"babyboi"},
		AllowedMethods: []string{"GET", "POST"},
	}).Handler(srv)
	// handler := cors.Default().Handler(srv)

	// if err := http.ListenAndServe(":8000", srv); err != nil {

	// if err := http.ListenAndServe(fmt.Sprintf(":%s", "8000"), handler); err != nil {
	// 	log.Fatal(err)
	// }

	portNumber, portNumberExists := os.LookupEnv("PORT")
	if !portNumberExists {
		portNumber = "8000"
	}

	if err := http.ListenAndServe(fmt.Sprintf(":%s", portNumber), c); err != nil {
		log.Fatal(err)
	}

	return nil
}
