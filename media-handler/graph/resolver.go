//go:generate go run ../hooks/bson.go
package graph

import (
	"context"
	amqp "github.com/rabbitmq/amqp091-go"
	"media-handler/db"
	"strconv"

	"github.com/99designs/gqlgen/graphql"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB         *db.DB
	UserHeader string
	RabbitMQ   *amqp.Connection
}

func (r *Resolver) GetUserHeader(ctx context.Context) (int, error) {
	headers := graphql.GetOperationContext(ctx).Headers
	userid := headers.Get(r.UserHeader)
	return strconv.Atoi(userid)
}
