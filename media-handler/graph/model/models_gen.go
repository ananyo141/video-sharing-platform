// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"time"
)

type Comment struct {
	ID        string    `json:"_id" bson:"_id"`
	Text      string    `json:"text" bson:"text"`
	UserID    int       `json:"userId" bson:"userId"`
	User      *User     `json:"user,omitempty" bson:"user"`
	VideoID   string    `json:"videoId" bson:"videoId"`
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}

type CreateCommentInput struct {
	Text    string `json:"text" bson:"text"`
	VideoID string `json:"videoId" bson:"videoId"`
}

type CreateVideoInput struct {
	Title       string `json:"title" bson:"title"`
	Description string `json:"description" bson:"description"`
	Source      string `json:"source" bson:"source"`
}

type DeleteCommentInput struct {
	ID string `json:"id" bson:"_id"`
}

type DeleteVideoInput struct {
	ID string `json:"id" bson:"_id"`
}

type Mutation struct {
}

type Query struct {
}

type Subscription struct {
}

type UpdateCommentInput struct {
	Text *string `json:"text,omitempty" bson:"text"`
}

type UpdateVideoInput struct {
	Title       *string `json:"title,omitempty" bson:"title"`
	Description *string `json:"description,omitempty" bson:"description"`
	Source      *string `json:"source,omitempty" bson:"source"`
}

type User struct {
	ID     int    `json:"id" bson:"_id"`
	Name   string `json:"name" bson:"name"`
	Email  string `json:"email" bson:"email"`
	RoleID int    `json:"role_id" bson:"role_id"`
}

type Video struct {
	ID          string     `json:"_id" bson:"_id"`
	Title       string     `json:"title" bson:"title"`
	Description string     `json:"description" bson:"description"`
	Source      string     `json:"source" bson:"source"`
	UserID      int        `json:"userId" bson:"userId"`
	User        *User      `json:"user,omitempty" bson:"user"`
	Likes       []int      `json:"likes" bson:"likes"`
	Comments    []*Comment `json:"comments" bson:"comments"`
	CreatedAt   time.Time  `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt" bson:"updatedAt"`
}

type VideoProgress struct {
	VideoID   string    `json:"videoId" bson:"videoId"`
	UserID    int       `json:"userId" bson:"userId"`
	Progress  int       `json:"progress" bson:"progress"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}
