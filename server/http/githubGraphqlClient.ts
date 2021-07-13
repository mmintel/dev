import { GraphQLClient } from "graphql-request";

export const githubGraphqlClient = new GraphQLClient(
  "https://api.github.com/graphql"
);
