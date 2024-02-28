package main

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/vektah/gqlparser/v2/gqlerror"

	"context"
	"encoding/json"
	"log"
	"media-handler/db"
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

	dbInstance := db.Connect()

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		DB:         dbInstance,
		UserHeader: "X-Auth-Id", // This is the header that will be used to get the user id
	}}))

	srv.SetRecoverFunc(func(ctx context.Context, err interface{}) error {
		// notify bug-tracker
		return gqlerror.Errorf("Internal server error %s", err)
	})

	srv.AddTransport(&transport.Websocket{})

	http.Handle("/media/playground", playground.Handler("GraphQL playground", "/media/graphql"))
	http.Handle("/media/graphql", srv)
	http.HandleFunc("/media/", func(w http.ResponseWriter, r *http.Request) {
		var success bool = true
		var status int = http.StatusOK
		var message string = "Media Handler API is running!"
		if r.URL.Path != "/media/" {
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

	log.Printf("connect to /media/playground for GraphQL playground")
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
