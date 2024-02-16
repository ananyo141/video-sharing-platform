package db

import (
	"context"
	"errors"
	"log"
	"time"

	"media-handler/graph/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (db *DB) GetComment(id string) (*model.Comment, error) {
	collection := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// db.videos.find({ "comments._id": ObjectId("65cfac9ba0375182ff75accf") }, { "comments.$": 1, "_id": 0 })
	_id, hexerr := primitive.ObjectIDFromHex(id)
	if hexerr != nil {
		return nil, hexerr
	}

	// MongoDB filter: { "comments._id": ObjectId("65cfabece6f894c8e1e4196b") }
	filter := bson.M{
		"comments._id": _id,
	}

	// MongoDB projection: { "_id": 0, "comments.$": 1 }
	projection := bson.M{
		"_id":        0,
		"comments.$": 1,
	}

	var comments map[string][]model.Comment
	err := collection.FindOne(ctx, filter, options.FindOne().SetProjection(projection)).Decode(&comments)

	if len(comments["comments"]) == 0 {
		return nil, errors.New("Comment not found")
	}
	extractedComment := comments["comments"][0]
	if err != nil {
		return nil, err
	}

	return &extractedComment, nil
}

func (db *DB) CreateComment(comment model.CreateCommentInput) (*model.Comment, error) {
	collection := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	currTime := time.Now()

	newCommentID := primitive.NewObjectID()

	insertComment := model.Comment{
		ID:        newCommentID.Hex(),
		Text:      comment.Text,
		UserID:    comment.UserID,
		CreatedAt: currTime,
		UpdatedAt: currTime,
	}

	_id, err := primitive.ObjectIDFromHex(comment.VideoID)
	if err != nil {
		return nil, err
	}
	// Create the filter to match the video by its ID
	filter := bson.M{"_id": _id}

	update := bson.M{
		"$push": bson.M{"comments": bson.M{
			"_id":       newCommentID,
			"text":      insertComment.Text,
			"userId":    insertComment.UserID,
			"createdAt": currTime,
			"updatedAt": currTime,
		}},
	}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	if result.ModifiedCount == 0 {
		return nil, errors.New("Video not found")
	}

	// If the comment was inserted, use the UpsertedID as the comment ID
	return &insertComment, nil
}

func (db *DB) UpdateComment(id string, comment model.UpdateCommentInput) (*model.Comment, error) {
	collection := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}
	update := bson.M{"$set": comment}
	_, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Println(err)
	}
	return db.GetComment(id)
}

func (db *DB) DeleteComment(id string) (*model.Comment, error) {
	collection := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	_id, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": _id}
	var comment model.Comment
	err := collection.FindOneAndDelete(ctx, filter).Decode(&comment)
	if err != nil {
		log.Println(err)
	}
	return &comment, err
}

func (db *DB) GetCommentsByUserID(userID string) ([]*model.Comment, error) {
	collection := db.client.Database(dbName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	var comments []*model.Comment
	cursor, err := collection.Find(ctx, bson.M{"userId": userID})
	if err != nil {
		log.Println(err)
	}
	if err = cursor.All(context.TODO(), &comments); err != nil {
		panic(err)
	}
	return comments, err
}
