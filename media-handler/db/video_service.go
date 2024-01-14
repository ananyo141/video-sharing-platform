package db

import (
	"context"
	"log"
	"media-handler/utils"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"media-handler/graph/model"
)

var collectionName = "videos"

// FIXME: remove log.Fatals and replace with proper error handling
func (db *DB) GetVideo(id string) *model.Video {
	videoCollec := db.client.Database(utils.Env["DB_NAME"]).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}
	var video model.Video
	err := videoCollec.FindOne(ctx, filter).Decode(&video)
	if err != nil {
		log.Fatal(err)
	}
	return &video
}

func (db *DB) GetVideos() []*model.Video {
	videoCollec := db.client.Database(utils.Env["DB_NAME"]).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	var videos []*model.Video
	cursor, err := videoCollec.Find(ctx, bson.D{})
	if err != nil {
		log.Fatal(err)
	}

	if err = cursor.All(context.TODO(), &videos); err != nil {
		panic(err)
	}

	return videos
}

func (db *DB) CreateVideo(jobInfo model.CreateVideoInput) *model.Video {
	videoCollec := db.client.Database(utils.Env["DB_NAME"]).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	inserg, err := videoCollec.InsertOne(ctx,
		bson.M{"title": jobInfo.Title, "description": jobInfo.Description, "userId": jobInfo.UserID,
			"createdAt": time.Now(), "updatedAt": time.Now(), "source": jobInfo.Source})

	if err != nil {
		log.Fatal(err)
	}

	insertedID := inserg.InsertedID.(primitive.ObjectID).Hex()
	// FIXME: use a struct to avoid repeating the same code
	returnVideo := model.Video{ID: insertedID, Title: jobInfo.Title,
		Description: jobInfo.Description, UserID: jobInfo.UserID, Source: jobInfo.Source,
		CreatedAt: time.Now(), UpdatedAt: time.Now()}
	return &returnVideo
}

func (db *DB) UpdateVideo(videoId string, videoInfo model.UpdateVideoInput) *model.Video {
	videoCollec := db.client.Database(utils.Env["DB_NAME"]).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	updateVideo := bson.M{}

	if videoInfo.Title != nil {
		updateVideo["title"] = videoInfo.Title
	}
	if videoInfo.Description != nil {
		updateVideo["description"] = videoInfo.Description
	}
	if videoInfo.UserID != nil {
		updateVideo["userId"] = videoInfo.UserID
	}
	updateVideo["updatedAt"] = time.Now()

	_id, _ := primitive.ObjectIDFromHex(videoId)
	filter := bson.M{"_id": _id}
	update := bson.M{"$set": updateVideo}

	results := videoCollec.FindOneAndUpdate(ctx, filter, update, options.FindOneAndUpdate().SetReturnDocument(1))

	var video model.Video

	if err := results.Decode(&video); err != nil {
		log.Fatal(err)
	}

	return &video
}

func (db *DB) DeleteVideo(videoId string) *model.Video {
	videoCollec := db.client.Database(utils.Env["DB_NAME"]).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(videoId)
	filter := bson.M{"_id": _id}
	_, err := videoCollec.DeleteOne(ctx, filter)
	if err != nil {
		log.Fatal(err)
	}
	return &model.Video{ID: videoId}
}
