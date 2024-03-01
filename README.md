# Vimero - A Video Sharing Service

## Overview

Vimero is a modern and feature-rich video sharing service that allows users to upload, share, and discover a wide range of video content. Whether you are a content creator looking to showcase your work or an avid viewer searching for captivating videos, Vimero provides a seamless platform to connect users through the power of video.

## Architecture
![diagram](https://github.com/ananyo141/video-sharing-platform/assets/74728797/f47e48c5-d368-4b72-8911-311e7f842874)

## Features

- **User Profiles:** Create personalized profiles to manage your uploaded videos and interact with the community.
- **Video Upload:** Easily upload and share your videos with the world. Vimero supports a variety of video formats.
- **Discover Content:** Explore a diverse range of videos from different categories and genres.
- **User Interactions:** Like, comment, and share videos. Engage with other users and build a vibrant community.
- **Responsive Design:** Access Vimero from any device with its responsive and user-friendly design.

## Getting Started

To run Vimero locally for development or testing purposes, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ananyo141/video-sharing-platform
   ```

2. Navigate to the project directory:

   ```bash
   cd video-sharing-platform
   ```

3. Use docker compose to run locally:

   ```bash
   docker compose up -d
   ```
   or run the production build
  ```bash
   docker compose -f prod.compose.yml up -d
   ```

4. Visit `http://localhost:8001` in your Postman to access Vimero APIs, by importing the collection given in the repo.

## Technologies Used

- Frontend: Next.js (WIP)
- Backend: Go, Rust, Java, Typescript

## Contributing

We welcome contributions to Vimero! If you would like to contribute new features, enhancements, or bug fixes, please raise a pull request or github issue.

## License

Vimero is licensed under the [APACHE 2.0](LICENSE).

## Acknowledgments

I would like to express my gratitude to the open-source community and the developers of the tools and libraries used in building Vimero. Thank you for your valuable contributions.

Happy sharing and viewing!
