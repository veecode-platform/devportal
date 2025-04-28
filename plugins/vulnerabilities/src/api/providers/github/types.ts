import { RepoProps, RepoVulnerability } from "../../../utils/types";

export interface IGithubProvider {
    fetchVulnerabilitiesFromRepositoryList(repos: RepoProps[]): Promise<RepoVulnerability[]>,
    fetchVulnerabititiesFromRepository(location: string): Promise<RepoVulnerability | null>
}