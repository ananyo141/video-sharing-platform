package network

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"media-handler/graph/model"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
)

var redisClient *redis.Client

func init() {
	// Replace these values with your actual Redis server details
	redisClient = redis.NewClient(&redis.Options{
		Addr:     "media-cache:6379",
		Password: "", // No password
		DB:       0,  // Default DB
	})
}

type UserApiResponse struct {
	Data    []*model.User `json:"data"`
	Message string        `json:"message"`
	Page    int           `json:"page"`
	Success bool          `json:"success"`
}

func checkCache(id int) (*model.User, error) {
	ctx := context.Background()
	result, err := redisClient.Get(ctx, fmt.Sprintf("user:%d", id)).Result()
	if err == redis.Nil {
		log.Println("Cache miss")
		return nil, nil // Cache miss
	} else if err != nil {
		log.Println("Redis error")
		return nil, err // Redis error
	}

	log.Println("Cache hit")
	var cachedUser model.User
	err = json.Unmarshal([]byte(result), &cachedUser)
	if err != nil {
		log.Println("Unmarshalling Error while getting cache: ", err)
		return nil, err
	}

	return &cachedUser, nil
}

func cacheUser(id int, user *model.User) error {
	ctx := context.Background()
	userJSON, err := json.Marshal(user)
	if err != nil {
		log.Println("Marshalling Error while setting cache: ", err)
		return err
	}

	err = redisClient.Set(ctx, fmt.Sprintf("user:%d", id), userJSON, 10*time.Minute).Err()
	if err != nil {
		log.Println("Cache Set Error: ", err)
		return err
	}

	return nil
}

func GetUserByIds(ids []int) (map[int]*model.User, error) {
	// Check the cache first
	cachedUsers := make(map[int]*model.User)
	for _, id := range ids {
		cachedUser, err := checkCache(id)
		if err != nil {
			return nil, err
		}
		if cachedUser != nil {
			cachedUsers[id] = cachedUser
		}
	}

	// Filter out cached users from the requested IDs
	remainingIDs := make([]int, 0)
	for _, id := range ids {
		if _, exists := cachedUsers[id]; !exists {
			remainingIDs = append(remainingIDs, id)
		}
	}

	// Make a GET request for remaining users from the user API
	if len(remainingIDs) > 0 {
		url := "http://traefik/users?"
		for _, id := range remainingIDs {
			url += fmt.Sprintf("id=%d&", id)
		}

		response, err := http.Get(url)
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		if response.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("unexpected status code: %d", response.StatusCode)
		}

		// Read and parse the response body
		body, err := io.ReadAll(response.Body)
		if err != nil {
			return nil, err
		}

		// Unmarshal the JSON data into a map of User objects
		var resDecoded UserApiResponse
		if err := json.Unmarshal(body, &resDecoded); err != nil {
			return nil, err
		}

		for _, user := range resDecoded.Data {
			cachedUsers[user.ID] = user
			// Cache the user
			if err := cacheUser(user.ID, user); err != nil {
				log.Printf("Failed to cache user %d: %v", user.ID, err)
			}
		}
	}

	return cachedUsers, nil
}

func GetUserById(id int) (*model.User, error) {
	cachedUser, err := checkCache(id)
	if err != nil {
		return nil, err
	}

	if cachedUser != nil {
		return cachedUser, nil
	}

	// Make a GET request for the user from the user API
	users, err := GetUserByIds([]int{id})
	if err != nil {
		return nil, err
	}

	return users[id], nil
}
