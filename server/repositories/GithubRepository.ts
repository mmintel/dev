import { gql, GraphQLClient } from "graphql-request";
import { GithubRepoDTO } from "../dtos/GithubRepoDTO";
import { GithubUserDTO } from "../dtos/GithubUserDTO";
import { GithubRepositoryFragment } from "../graphql/GithubRepositoryFragment";
import { GithubUserFragment } from "../graphql/GithubUserFragment";

export class GithubRepository {
  constructor(private graphqlClient: GraphQLClient) {}

  async getUser(username: string): Promise<GithubUserDTO> {
    const request = await this.graphqlClient.request(
      gql`
        query GithubContributionsQuery($username: String!) {
          user(login: $username) {
            ...GithubUserFragment
          }
        }
        ${GithubUserFragment}
      `,
      { username }
    );
    return request.user;
  }

  async getRepos(username: string): Promise<GithubRepoDTO[]> {
    const request = await this.graphqlClient.request(
      gql`
        query GithubContributionsQuery($username: String!) {
          user(login: $username) {
            repositories(
              first: 10
              orderBy: { field: STARGAZERS, direction: DESC }
              isFork: false
              ownerAffiliations: OWNER
            ) {
              edges {
                node {
                  ...GithubRepositoryFragment
                }
              }
            }
          }
        }
        ${GithubRepositoryFragment}
      `,
      { username }
    );
    return request.user.repositories.edges.map((e) => e.node);
  }
}
