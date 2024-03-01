package utils

import (
	"regexp"
	"strings"
)

func NormalizeFilename(filename string) string {
	// Convert to lowercase
	filename = strings.ToLower(filename)

	// Replace spaces with '-'
	filename = strings.ReplaceAll(filename, " ", "-")

	// Remove special characters using a regular expression
	regExp := regexp.MustCompile("[^a-zA-Z0-9-]")
	filename = regExp.ReplaceAllString(filename, "")

	// Truncate to 20 characters
	if len(filename) > 20 {
		filename = filename[:20]
	}

	return filename
}
