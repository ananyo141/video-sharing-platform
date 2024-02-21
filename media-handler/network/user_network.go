package network

import (
	"encoding/json"
	"fmt"
	"io"
	"media-handler/graph/model"
	"net/http"
)

type UserApiResponse struct {
	Data    []*model.User `json:"data"`
	Message string        `json:"message"`
	Page    int           `json:"page"`
	Success bool          `json:"success"`
}

func GetUserByIds(ids []int) (map[int]*model.User, error) {
	// Construct the URL with the list of IDs
	url := "http://traefik/users?"
	for _, id := range ids {
		url += fmt.Sprintf("id=%d&", id)
	}

	// Make a GET request to the user API
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
	// log.Println(string(body))
	users := make(map[int]*model.User)
	if err := json.Unmarshal(body, &resDecoded); err != nil {
		return nil, err
	}

	for _, user := range resDecoded.Data {
		users[user.ID] = user
	}

	return users, nil
}

func GetUserById(id int) (*model.User, error) {
	res, err := GetUserByIds([]int{id})
	if err != nil {
		return nil, err
	}
	return res[id], nil
}
