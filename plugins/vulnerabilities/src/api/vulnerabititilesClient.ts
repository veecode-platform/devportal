import { ConfigApi } from "@backstage/core-plugin-api";
import { GithubProvider } from "./providers";
import { RepoProps, RepoVulnerability } from "../utils/types";
import { VulnerabilitiesApi } from "./vulnerabilitiesApi";
import { CatalogApi } from "@backstage/plugin-catalog-react";
import { ANNOTATION_LOCATION } from "../utils/contants/annotations";
import { extractGitHubInfo } from "../utils/helpers/extractGithubInfo";


export class VulnerabilitiesClient implements VulnerabilitiesApi{

  private githubProvider:GithubProvider;

  constructor( 
    private readonly configApi: ConfigApi,
    private readonly catalogApi: CatalogApi
  ) {
    this.githubProvider = new GithubProvider(this.configApi)
  }

    // Checkar como será a destinção entre os providers e o tipo que será listado na tabela, sugiro incorporar um filtro

    private async fetchVulnerabilitiesFromRepositoryList(
      repos: RepoProps[],
    ): Promise<RepoVulnerability[]> {
      // Adicionar alguma validação para chamar o gitprovider expecífico quando for adicionar o gitlab
      return await this.githubProvider.fetchVulnerabilitiesFromRepositoryList(repos)
    }

  // TODO filter para listar mais opções de entidades e/ou todas
  async fetchVulnerabilitiesFromCatalogEntities() {
    const entities = await this.catalogApi.getEntities({
      filter: { kind: 'Component', 'spec.type': 'service' }, //TODO remover hardcoded
    });
    const entitiesRepoProps =  entities.items.map(entity => {
      const location = entity.metadata.annotations![ANNOTATION_LOCATION];
      const { owner, repo } = extractGitHubInfo(location)
      return { owner, name: repo };
    });
    return this.fetchVulnerabilitiesFromRepositoryList(entitiesRepoProps)
  }

  async fetchVulnerabititiesFromRepository(location:string):Promise<RepoVulnerability|null>{
    // Adicionar alguma validação para chamar o gitprovider expecífico quando for adicionar o gitlab
    return await this.githubProvider.fetchVulnerabititiesFromRepository(location);
  }
   
  }