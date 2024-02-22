//go:generate go run ../hooks/bson.go
package graph

import (
	"context"
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
}

func (r *Resolver) GetUserHeader(ctx context.Context) (int, error) {
	headers := graphql.GetOperationContext(ctx).Headers
	userid := headers.Get(r.UserHeader)
	return strconv.Atoi(userid)
}
