export interface GithubRepoDTO {
  id: string;
  stargazerCount: number;
  url: string;
  name: string;
  forkCount: number;
  homepageUrl?: string;
  primaryLanguage: {
    name: string;
  };
}
