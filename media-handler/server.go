package main

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	"encoding/json"
	"log"
	"media-handler/graph"
	"media-handler/utils"
	"net/http"
)

const defaultPort = "3000"

func main() {
	port := utils.Env["PORT"]
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/playground", playground.Handler("GraphQL playground", "/graphql"))
	http.Handle("/graphql", srv)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var success bool = true
		var status int = http.StatusOK
		var message string = "Media Handler API is running!"
		if r.URL.Path != "/" {
			success = false
			status = http.StatusNotFound
			message = "Please use a valid route"
		}
		response := map[string]interface{}{
			"success": success,
			"message": message,
			"data": map[string]string{
				"playground": "/playground",
				"graphql":    "/graphql",
			},
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		json.NewEncoder(w).Encode(response)
	})

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
