import { ApolloClient, gql } from "@apollo/client";

export class GithubRepository {
  constructor(private graphqlClient: ApolloClient<any>) {}

  async getProfile(username: string) {
    const request = await fetch(`https://api.github.com/users/${username}`, {
      method: "GET",
      headers: {
        accept: "application/vnd.github.v3+jsonv",
      },
    });
    const json = await request.json();
    return {
      login: json.login,
      id: json.id,
      avatarUrl: json.avatar_url,
      url: json.html_url,
      name: json.name,
      location: json.location,
      company: json.company,
      email: json.email,
      hireable: json.hireable,
      bio: json.bio,
      reposCount: json.public_repos,
      gistsCount: json.public_gists,
      followersCount: json.followers,
      followingsCount: json.following,
    };
  }

  async getRepos(username: string) {
    const request = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        method: "GET",
        headers: {
          accept: "application/vnd.github.v3+jsonv",
        },
      }
    );
    const json = await request.json();

    return json.map((repo) => ({
      id: repo.id,
      slug: repo.name,
      name: repo.fullName,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      watchers: repo.watchers_count,
      language: repo.language,
      homepage: repo.homepage,
    }));
  }

  async getContributions(username: string, token: string) {
    const request = await this.graphqlClient.query({
      variables: { username },
      context: {
        headers: {
          Authorization: `token ${token}`,
        },
      },
      query: gql`
        query GithubContributionsQuery($username: String) {
          user(login: $username) {
            name
            contributionsCollection {
              contributionCalendar {
                colors
                totalContributions
                weeks {
                  contributionDays {
                    color
                    contributionCount
                    date
                    weekday
                  }
                  firstDay
                }
              }
            }
          }
        }
      `,
    });
    console.log(request);
  }
}
