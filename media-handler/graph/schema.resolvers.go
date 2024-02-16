package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.42

import (
	"context"
	"media-handler/graph/model"
)

// FIXME: Add validation to the resolvers
// CreateVideo is the resolver for the createVideo field.
func (r *mutationResolver) CreateVideo(ctx context.Context, input model.CreateVideoInput) (*model.Video, error) {
	return r.DB.CreateVideo(input)
}

// UpdateVideo is the resolver for the updateVideo field.
func (r *mutationResolver) UpdateVideo(ctx context.Context, id string, input model.UpdateVideoInput) (*model.Video, error) {
	return r.DB.UpdateVideo(id, input)
}

// DeleteVideo is the resolver for the deleteVideo field.
func (r *mutationResolver) DeleteVideo(ctx context.Context, id string) (*model.Video, error) {
	return r.DB.DeleteVideo(id)
}

// Videos is the resolver for the videos field.
func (r *queryResolver) Videos(ctx context.Context) ([]*model.Video, error) {
	return r.DB.GetVideos()
}

// Video is the resolver for the video field.
func (r *queryResolver) Video(ctx context.Context, id string) (*model.Video, error) {
	return r.DB.GetVideo(id)
}

// ********* Comment Resolvers ********* //
func (r *mutationResolver) CreateComment(ctx context.Context, input model.CreateCommentInput) (*model.Comment, error) {
	return nil, nil
}

func (r *mutationResolver) UpdateComment(ctx context.Context, id string, input model.UpdateCommentInput) (*model.Comment, error) {
  return nil, nil
}

func (r *mutationResolver) DeleteComment(ctx context.Context, id string) (*model.Comment, error) {
  return nil, nil
}

func (r *queryResolver) Comments(ctx context.Context) ([]*model.Comment, error) {
  return nil, nil
}

func (r *queryResolver) Comment(ctx context.Context, id string) (*model.Comment, error) {
  return nil, nil
}

// ********* Like Resolver ********* //
func (r *mutationResolver) LikeVideo(ctx context.Context, videoId string, userid int) (*model.Video, error) {
  return nil, nil
}


// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
