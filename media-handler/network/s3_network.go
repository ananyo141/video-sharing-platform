package network

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type s3Response struct {
	Message string `json:"message"`
	Data    Data   `json:"data"`
	Success bool   `json:"success"`
}

type Data struct {
	ObjectName   string `json:"objectName"`
	PresignedURL string `json:"presignedUrl"`
}

// Return ObjectName, PresignedURL, error
func GetPresignedUrl(filename string) (*string, *string, error) {
	url := "http://traefik/assets/presignedUrl?filename=" + filename
	response, err := http.Get(url)
	if err != nil {
		return nil, nil, err
	}
	defer response.Body.Close()

	// Read and parse the response body
	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, nil, err
	}

	// Unmarshal the JSON data into a map of User objects
	var resDecoded s3Response
	if err := json.Unmarshal(body, &resDecoded); err != nil {
		return nil, nil, err
	}

	if response.StatusCode != http.StatusOK {
		return nil, nil, fmt.Errorf("Status code: %d, %s", response.StatusCode, resDecoded.Message)
	}

	return &resDecoded.Data.ObjectName, &resDecoded.Data.PresignedURL, nil
}
