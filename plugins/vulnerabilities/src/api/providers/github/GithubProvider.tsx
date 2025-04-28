import { ConfigApi } from "@backstage/core-plugin-api";
import { Octokit } from "@octokit/rest";
import { RepoProps, RepoVulnerability } from "../../../utils/types";
import { IGithubProvider } from "./types";
import { extractGitHubInfo } from "../../../utils/helpers/extractGithubInfo";

export class GithubProvider implements IGithubProvider {
    constructor(private readonly configApi: ConfigApi){}

    private async getToken(){
        const token = this.configApi.getConfig("scaffolder")?.getConfig("providers").getConfigArray("github")?.[0]?.getOptionalString("token"); // TODO (provisóriamente pegando da key scaffolder)
        return token
      }
    
      private async getOctokit(hostname: string):Promise<Octokit>{  
        const token = await this.getToken();
        return new Octokit({ auth: token, hostname });
      }

      private async getListAlertsForRepo({owner,name}:RepoProps){
        const octokit = await this.getOctokit("github.com") //hardcoded
        return await octokit.rest.dependabot.listAlertsForRepo({
            owner: owner,
            repo: name
          });
      }

      async fetchVulnerabilitiesFromRepositoryList(
        repos: RepoProps[]
      ): Promise<RepoVulnerability[]> {
    
        const results: RepoVulnerability[] = [];
      
        for (const repo of repos) {
          try {
            const alerts = await this.getListAlertsForRepo({owner: repo.owner, name: repo.name});

            const severityCount = {
              critical: 0,
              high: 0,
              medium: 0,
              low: 0,
            };
      
            for (const alert of alerts.data) {
              const severity = alert.security_vulnerability?.severity?.toLowerCase();
              if (severity && severityCount.hasOwnProperty(severity)) {
                (severityCount as any)[severity]++;
              }
            }
      
            results.push({
              repo: `${repo.owner}/${repo.name}`,
              total: alerts.data.length,
              ...severityCount,
            });
          } catch (error) {
            console.error(`Error fetching alerts for ${repo.owner}/${repo.name}:`, error);
            //TODO (adicionar alguma tratativa)
          }
        }
      
        return results;
      }

      async fetchVulnerabititiesFromRepository(location:string): Promise<RepoVulnerability|null> {
        const {owner, repo} = extractGitHubInfo(location);
        try {
            const alerts = await this.getListAlertsForRepo({owner: owner, name: repo});

            const severityCount = {
              critical: 0,
              high: 0,
              medium: 0,
              low: 0,
            };
      
            for (const alert of alerts.data) {
              const severity = alert.security_vulnerability?.severity?.toLowerCase();
              if (severity && severityCount.hasOwnProperty(severity)) {
                (severityCount as any)[severity]++;
              }
            }
      
            return {
              repo: `${owner}/${repo}`,
              total: alerts.data.length,
              ...severityCount,
            } as RepoVulnerability
            
          } catch (error) {
            console.error(`Error fetching alerts for ${repo}/${repo}:`, error);
            return null
            //TODO (adicionar alguma tratativa)
          }
      }
      
}