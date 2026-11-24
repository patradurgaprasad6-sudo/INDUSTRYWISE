// INDUSTRYWISE lightweight event gateway starter.
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type Status struct {
	Service   string `json:"service"`
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
}

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(Status{"industrywise-gateway", "online", time.Now().UTC().Format(time.RFC3339)})
	})
	log.Println("Gateway listening on :8090")
	log.Fatal(http.ListenAndServe(":8090", nil))
}
