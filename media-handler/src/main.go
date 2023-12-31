package main

import (
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"github.com/graphql-go/graphql"
	"log"
)

func main() {
	fields := graphql.Fields{
		"hello": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return "world", nil
			},
		},
	}
	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	app := fiber.New()

	app.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.SendString("Hello, World !")
	})

	app.Get("/api", func(ctx *fiber.Ctx) error {
		return ctx.SendString("Hello, API !")
	})

	app.Post("/query", func(ctx *fiber.Ctx) error {
		query := string(ctx.Body())
		params := graphql.Params{Schema: schema, RequestString: query}
		r := graphql.Do(params)
		if len(r.Errors) > 0 {
			ctx.SendString("failed to execute graphql operation")
		}
		rJSON, err := json.Marshal(r)
		if err != nil {
			ctx.SendString("cannot marshal json")
		}
		return ctx.JSON(string(rJSON))
	})

	log.Fatal(app.Listen(":3000"))
}
