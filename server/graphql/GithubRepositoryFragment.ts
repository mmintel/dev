import { gql } from "graphql-request";

export const GithubRepositoryFragment = gql`
  fragment GithubRepositoryFragment on Repository {
    id
    stargazerCount
    url
    name
    forkCount
    homepageUrl
    primaryLanguage {
      name
    }
  }
`;
