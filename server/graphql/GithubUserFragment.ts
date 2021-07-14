import { gql } from "graphql-request";

export const GithubUserFragment = gql`
  fragment GithubUserFragment on User {
    id
    name
    login
    location
    isHireable
    avatarUrl
    bio
    blog
    url
    company
    email
    followers {
      totalCount
    }
    following {
      totalCount
    }
    repositories {
      totalCount
    }
    gists {
      totalCount
    }
  }
`;
