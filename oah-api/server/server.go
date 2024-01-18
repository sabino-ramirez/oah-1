package server

import (
	"log"
	"net"
	"net/http"
	"os"

	"time"

	"github.com/gorilla/mux"
	"github.com/rueian/rueidis"
)

type Server struct {
	router *mux.Router
	cache  rueidis.Client
}

// type RedisClient struct {
// 	Rclient rueidis.Client
// }

// func NewRedisClient() *RedisClient {
// 	redisAddress := fmt.Sprintf("%v:6379", os.Getenv("REDIS_URL"))
//
// 	r, err := rueidis.NewClient(rueidis.ClientOption{
// 		Password:     "sabinor",
// 		InitAddress:  []string{redisAddress},
// 		DisableCache: true,
// 		ClientName:   "newClientClient",
// 	})
//
// 	if err != nil {
// 		log.Println("error making rueidis client: ", err)
// 	}
//
// 	c := &RedisClient{
// 		Rclient: r,
// 	}
//
// 	return c
// }

var netTransport = &http.Transport{
	Dial: (&net.Dialer{
		Timeout: 20 * time.Second,
	}).Dial,
	TLSHandshakeTimeout: 20 * time.Second,
}

var ovationClient = &http.Client{
	Timeout:   time.Second * 20,
	Transport: netTransport,
}

func NewServer() *Server {
	// redisAddress := fmt.Sprintf("%v:6379", os.Getenv("REDIS_URL"))
	redisHost, redisHostEnvExists := os.LookupEnv("REDIS_HOST")
	if !redisHostEnvExists {
		redisHost = "localhost:6379"
	}

	redisPassword, redisPasswordEnvExists := os.LookupEnv("REDIS_PASSWORD")
	if !redisPasswordEnvExists {
		redisPassword = "sabinor"
	}

	r, err := rueidis.NewClient(rueidis.ClientOption{
		Password:     redisPassword,
		InitAddress:  []string{redisHost},
		DisableCache: true,
		ClientName:   "newServerClient",
	})

	if err != nil {
		log.Println("error making rueidis client: ", err)
	}

	// defer r.Close()

	s := &Server{
		router: mux.NewRouter(),
		cache:  r,
	}

	s.routes()
	return s
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}

// func (s *Server) originAllow(h http.HandlerFunc) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
//
// 		h(w, r)
// 	}
// }

func (s *Server) routes() {
	fs := http.FileServer(http.Dir("/web"))

	// s.router.Handle("/", fs)
	// s.router.HandleFunc("/", func(w http.ResponseWriter, _ *http.Request) {
	// 	fmt.Println("available")
	//
	// 	w.Header().Set("Content-Type", "application/json")
	//
	// 	w.WriteHeader(http.StatusCreated)
	//
	// 	resp := make(map[string]string)
	// 	resp["message"] = "available"
	//
	// 	respJson, err := json.Marshal(resp)
	// 	if err != nil {
	// 		log.Println("status json marshal err:", err)
	// 	}
	//
	// 	if _, err := w.Write(respJson); err != nil {
	// 		log.Printf("err writing json in scan: %v", err)
	// 	}
	// })

	s.router.HandleFunc("/auth", s.handleAuthorizeToken())
	// s.router.HandleFunc("/reqs", s.handleGetReqs())
	// s.router.HandleFunc("/reqs", s.handleGetReqsCSV())
	// s.router.HandleFunc("/search", s.handleSearch())
	s.router.HandleFunc("/search", s.handleSearchCSV())
	s.router.HandleFunc("/update", s.handleUpdateReqCSV()).Methods("POST")
	s.router.HandleFunc("/scan", s.handleScanCSV())
	s.router.PathPrefix("/").Handler(http.StripPrefix("/", fs))
}
