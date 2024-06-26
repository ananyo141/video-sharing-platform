package db

import (
	"context"
	"errors"
	"log"
	"path/filepath"
	"time"

	"media-handler/graph/model"
	"media-handler/network"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (db *DB) GetVideo(id string) (*model.Video, error) {
	videoCollec := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}
	var video model.Video
	err := videoCollec.FindOne(ctx, filter).Decode(&video)
	if err != nil {
		log.Println(err)
	}

	// create an array of required user ids
	userIds := make(map[int]bool)

	userIds[video.UserID] = true
	for i := range video.Comments {
		userIds[video.Comments[i].UserID] = true
	}

	userIdsArr := make([]int, 0, len(userIds))
	for k := range userIds {
		userIdsArr = append(userIdsArr, k)
	}

	users, err := network.GetUserByIds(userIdsArr)
	video.User = users[video.UserID]
	for i := range video.Comments {
		video.Comments[i].User = users[video.Comments[i].UserID]
	}

	return &video, err
}

func (db *DB) GetVideos(search *string, userId *int) ([]*model.Video, error) {
	videoCollec := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Initialize the filter with the search condition
	filter := bson.M{}
	if search != nil {
		filter["title"] = primitive.Regex{Pattern: *search, Options: "i"}
	}
	// If userId is provided, add it to the filter
	if userId != nil {
		filter["userId"] = *userId
	}

	var videos []*model.Video
	cursor, err := videoCollec.Find(ctx, filter)
	if err != nil {
		log.Println(err)
	}

	if err = cursor.All(context.TODO(), &videos); err != nil {
		panic(err)
	}

	// create an array of required user ids
	userIds := make(map[int]bool)

	for _, video := range videos {
		userIds[video.UserID] = true
		for i := range video.Comments {
			userIds[video.Comments[i].UserID] = true
		}
	}

	userIdsArr := make([]int, 0, len(userIds))
	for k := range userIds {
		userIdsArr = append(userIdsArr, k)
	}

	users, err := network.GetUserByIds(userIdsArr)
	for vi, video := range videos {
		videos[vi].User = users[video.UserID]
		for i := range video.Comments {
			video.Comments[i].User = users[video.Comments[i].UserID]
		}
	}

	return videos, err
}

func (db *DB) CreateVideo(video model.CreateVideoInput, source string, userid int) (*model.Video, error) {
	videoCollec := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	timeCreated := time.Now()
	transcodedPath := "/transcoded-bucket/hls_encoded/" + filepath.Base(source) + "/playlist.m3u8"
	insertedVideo, err := videoCollec.InsertOne(ctx,
		bson.M{
			"title":         video.Title,
			"description":   video.Description,
			"userId":        userid,
			"thumbnailUrl":  video.ThumbnailURL,
			"source":        source,
			"transcodedUrl": transcodedPath,
			"likes":         []int{},
			"comments":      []model.Comment{},
			"createdAt":     timeCreated,
			"updatedAt":     timeCreated,
		})

	if err != nil {
		log.Println(err)
	}

	insertedID := insertedVideo.InsertedID.(primitive.ObjectID).Hex()
	// FIXME: use a struct to avoid repeating the same code
	returnVideo := model.Video{ID: insertedID,
		Title:         video.Title,
		Description:   video.Description,
		ThumbnailURL:  &video.ThumbnailURL,
		UserID:        userid,
		Source:        source,
		TranscodedURL: &transcodedPath,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now()}
	return &returnVideo, err
}

func (db *DB) UpdateVideo(videoId string, videoInfo model.UpdateVideoInput, userid int) (*model.Video, error) {
	videoCollec := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	updateVideo := bson.M{}

	if videoInfo.Title != nil {
		updateVideo["title"] = videoInfo.Title
	}
	if videoInfo.ThumbnailURL != nil {
		updateVideo["thumbnailUrl"] = videoInfo.ThumbnailURL
	}
	if videoInfo.Description != nil {
		updateVideo["description"] = videoInfo.Description
	}
	updateVideo["updatedAt"] = time.Now()

	_id, _ := primitive.ObjectIDFromHex(videoId)
	filter := bson.M{"_id": _id, "userId": userid}
	update := bson.M{"$set": updateVideo}

	results := videoCollec.FindOneAndUpdate(ctx, filter, update, options.FindOneAndUpdate().SetReturnDocument(1))

	var video model.Video

	err := results.Decode(&video)
	if err != nil {
		log.Println(err)
	}

	return &video, err
}

func (db *DB) DeleteVideo(videoId string, userid int) (*model.Video, error) {
	videoCollec := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(videoId)
	filter := bson.M{"_id": _id, "userId": userid}
	result, err := videoCollec.DeleteOne(ctx, filter)
	if err != nil {
		log.Println(err)
	}
	if result.DeletedCount == 0 {
		return nil, errors.New("Video not found")
	}
	return &model.Video{ID: videoId}, err
}

// NOTE: This is the query to update the likes field in the video collection
// db.videos.update(
//
//	{ _id: ObjectId("65d4b7f6b8524973a51fc399") },
//	[{
//	  $set: {
//	    likes: {
//	      $cond: {
//	        if: { $in: [userId, "$likes"] },
//	        then: { $setDifference: ["$likes", [userId]] },
//	        else: { $concatArrays: ["$likes", [userId]] },
//	      }
//	    }
//	  }
//	}]
//
// );
func (db *DB) LikeVideo(videoId string, userId int) (*model.Video, error) {
	videoCollec := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_id, _ := primitive.ObjectIDFromHex(videoId)
	filter := bson.M{"_id": _id}
	update := bson.A{bson.M{
		"$set": bson.M{
			"likes": bson.M{
				"$cond": bson.M{
					"if":   bson.M{"$in": bson.A{userId, "$likes"}},
					"then": bson.M{"$setDifference": bson.A{"$likes", bson.A{userId}}},
					"else": bson.M{"$concatArrays": bson.A{"$likes", bson.A{userId}}},
				},
			},
		},
	}}

	var video model.Video
	options := options.FindOneAndUpdate().SetReturnDocument(options.After)
	err := videoCollec.FindOneAndUpdate(ctx, filter, update, options).Decode(&video)
	if err != nil {
		log.Println(err)
	}
	return &video, err
}
