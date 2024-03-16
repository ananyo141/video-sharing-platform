package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.42

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"media-handler/graph/model"
	"media-handler/network"
	"media-handler/utils"
	"time"
)

// CreateVideo is the resolver for the createVideo field.
func (r *mutationResolver) CreateVideo(ctx context.Context, input model.CreateVideoInput) (*model.CreateVideoPayload, error) {
	userid, err := r.GetUserHeader(ctx)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	var filename = fmt.Sprintf("%s_%d.%s", utils.NormalizeFilename(input.Title),
		time.Now().UnixMilli(), input.FileExtension)
	// get the presigned url from the video service
	objectName, presignedURL, err := network.GetPresignedUrl(filename)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	// save with the transcoded_url
	video, err := r.DB.CreateVideo(input, *objectName, userid)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return &model.CreateVideoPayload{
		PresignedURL: *presignedURL,
		Video:        video,
	}, nil
}

// UpdateVideo is the resolver for the updateVideo field.
func (r *mutationResolver) UpdateVideo(ctx context.Context, id string, input model.UpdateVideoInput) (*model.Video, error) {
	userid, err := r.GetUserHeader(ctx)
	if err != nil {
		return nil, err
	}
	return r.DB.UpdateVideo(id, input, userid)
}

// DeleteVideo is the resolver for the deleteVideo field.
func (r *mutationResolver) DeleteVideo(ctx context.Context, id string) (*model.Video, error) {
	userid, err := r.GetUserHeader(ctx)
	if err != nil {
		return nil, err
	}
	return r.DB.DeleteVideo(id, userid)
}

// ********* Like Resolver ********* //
func (r *mutationResolver) LikeVideo(ctx context.Context, id string) (*model.Video, error) {
	userid, err := r.GetUserHeader(ctx)
	if err != nil {
		return nil, err
	}
	return r.DB.LikeVideo(id, userid)
}

// ********* Comment Resolvers ********* //
func (r *mutationResolver) CreateComment(ctx context.Context, input model.CreateCommentInput) (*model.Comment, error) {
	userid, err := r.GetUserHeader(ctx)
	if err != nil {
		return nil, err
	}
	return r.DB.CreateComment(input, userid)
}

// UpdateComment is the resolver for the updateComment field.
func (r *mutationResolver) UpdateComment(ctx context.Context, id string, input model.UpdateCommentInput) (*model.Comment, error) {
	userid, err := r.GetUserHeader(ctx)
	if err != nil {
		return nil, err
	}
	return r.DB.UpdateComment(id, input, userid)
}

// DeleteComment is the resolver for the deleteComment field.
func (r *mutationResolver) DeleteComment(ctx context.Context, id string) (*model.Comment, error) {
	userid, err := r.GetUserHeader(ctx)
	if err != nil {
		return nil, err
	}
	return r.DB.DeleteComment(id, userid)
}

// Videos is the resolver for the videos field.
func (r *queryResolver) Videos(ctx context.Context, search *string, userID *int) ([]*model.Video, error) {
	return r.DB.GetVideos(search, userID)
}

// Video is the resolver for the video field.
func (r *queryResolver) Video(ctx context.Context, id string) (*model.Video, error) {
	return r.DB.GetVideo(id)
}

// Comment is the resolver for the comment field.
func (r *queryResolver) Comment(ctx context.Context, id string) (*model.Comment, error) {
	return r.DB.GetComment(id)
}

// VideoProgress is the resolver for the videoProgress field.
func (r *subscriptionResolver) VideoProgress(ctx context.Context, videoID string) (<-chan *model.VideoProgress, error) {
	channel := make(chan *model.VideoProgress)
	failOnError := func(err error, msg string) {
		if err != nil {
			log.Panicf("%s: %s", msg, err)
		}
	}
	go func() {
		// Handle deregistration of the channel here. Note the `defer`
		defer close(channel)

		rabbitCh, err := r.RabbitMQ.Channel()
		failOnError(err, "Failed to open a channel")
		defer rabbitCh.Close()

		err = rabbitCh.ExchangeDeclare(
			"video_processing_exchange", // name
			"direct",                    // type
			false,                       // durable
			false,                       // auto-deleted
			false,                       // internal
			false,                       // no-wait
			nil,                         // arguments
		)
		failOnError(err, "Failed to declare an exchange")

		q, err := rabbitCh.QueueDeclare(
			"",    // name -- empty string creates a unique queue name
			false, // durable
			true,  // delete when unused
			false, // exclusive
			false, // no-wait
			nil,   // arguments
		)
		failOnError(err, "Failed to declare a queue")
		err = rabbitCh.QueueBind(
			q.Name,                      // queue name
			videoID,                     // routing key -- filename
			"video_processing_exchange", // exchange
			false,
			nil)
		failOnError(err, "Failed to bind a queue")

		msgs, err := rabbitCh.Consume(
			q.Name, // queue
			"",     // consumer
			false,  // auto-ack
			false,  // exclusive
			false,  // no-local
			false,  // no-wait
			nil,    // args
		)
		failOnError(err, "Failed to consume messages from RabbitMQ")

		// Set a timeout for the subscription.
		timeout := 3 * time.Second
		timer := time.NewTimer(timeout)
		for {
			select {
			case <-timer.C:
				log.Println("Timed out waiting for messages.")
				return
			case msg, ok := <-msgs:
				if !ok {
					log.Println("End of messages")
					return
				}

				log.Printf("Received a message: %s", msg.Body)

				type Payload struct {
					Progress float64 `json:"progress"`
					File     string  `json:"file"`
				}
				// Prepare your object.
				currentTime := time.Now()
				var payload Payload
				err := json.Unmarshal(msg.Body, &payload)
				if err != nil {
					log.Printf("Failed to parse message: %s", err)
					continue
				}
				t := &model.VideoProgress{
					VideoID:   payload.File,
					UserID:    1,
					UpdatedAt: currentTime,
					Progress:  int(payload.Progress),
				}

				// The subscription may have got closed due to the client disconnecting.
				// Hence we do send in a select block with a check for context cancellation.
				// This avoids goroutine getting blocked forever or panicking,
				select {
				case <-ctx.Done(): // This runs when context gets cancelled. Subscription closes.
					fmt.Println("Subscription Closed")
					// Handle deregistration of the channel here. `close(ch)`
					return // Remember to return to end the routine.

				case channel <- t: // This is the actual send.
					msg.Ack(true) // Acknowledge the message.
				}
				if int(payload.Progress) == 100 {
					return
				}

				// Reset the timer
				if !timer.Stop() {
					<-timer.C
				}
				timer.Reset(timeout)
			}
		}
	}()
	// We return the channel and no error.
	return channel, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// Subscription returns SubscriptionResolver implementation.
func (r *Resolver) Subscription() SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
