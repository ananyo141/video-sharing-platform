import { GraphQLClient, gql } from "graphql-request";

export function getCookie(name: string) {
  if (typeof document === "undefined") return;

  const value = "; " + document.cookie;
  const decodedValue = decodeURIComponent(value);
  const parts = decodedValue.split("; " + name + "=");

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
}

export interface VideoInput {
  title: string;
  thumbnailUrl: string;
  description: string;
  fileExtension: string;
}

async function createVideo(videoInput: VideoInput): Promise<any> {
  try {
    const JWT_TOKEN = getCookie("jwt-token");

    if (!JWT_TOKEN) {
      throw new Error("JWT token is missing");
    }

    const token = JWT_TOKEN;

    const client = new GraphQLClient("https://videosite.ddns.net/media/graphql", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    const mutation = gql`
      mutation CreateVideo($title: String!,$thumbnailUrl: String!, $description: String!, $fileExtension: String!) {
        createVideo(
          input: {
            title: $title
            thumbnailUrl: $thumbnailUrl
            description: $description
            fileExtension: $fileExtension
          }
        ) {
          presignedUrl
          video {
            _id
            title
            thumbnailUrl
            userId
            source
          }
        }
      }
    `;

    const variables = {
      title: videoInput.title,
      description: videoInput.description,
      thumbnailUrl: videoInput.thumbnailUrl,
      fileExtension: videoInput.fileExtension,
    };

    const data = await client.request(mutation, variables);
    return data;
  } catch (error) {
    throw new Error("Error creating video: " + error);
  }
}

export default createVideo;
