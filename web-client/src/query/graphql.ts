import { gql } from "@apollo/client";

const get_videos = gql`query {
  videos {
    _id
    title
    description
    userId
    createdAt
    updatedAt
    user {
      email
    }
    likes
    comments {
      _id
      text
      user {
        id
        email
        role_id
      }
    }
  }
}
`

export {get_videos};