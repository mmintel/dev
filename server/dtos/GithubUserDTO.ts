export interface GithubUserDTO {
  id: string;
  name: string;
  login: string;
  location?: string;
  isHireable?: boolean;
  blog?: string;
  url: string;
  avatarUrl: string;
  bio?: string;
  company?: string;
  email?: string;
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  repositories: {
    totalCount: number;
  };
  gists: {
    totalCount: number;
  };
}
