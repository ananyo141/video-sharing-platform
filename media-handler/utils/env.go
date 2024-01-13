package utils

import (
	"log"

	"github.com/joho/godotenv"
)

func LoadEnv() map[string]string {
	var env map[string]string
	env, err := godotenv.Read(".env.docker")
	if err != nil {
		log.Fatal("Error loading environment file")
		return nil
	}

	return env
}

// Export a global dictionary of environment variables
var Env map[string]string = LoadEnv()
