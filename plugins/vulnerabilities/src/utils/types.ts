export type RepoVulnerability = {
  repo: string;
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
};

export type RepoProps = {
    owner: string;
    name: string;
}