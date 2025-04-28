import { createApiRef } from "@backstage/core-plugin-api";
import { RepoVulnerability } from "../utils/types";

export const vulnerabilitiesApiRef = createApiRef<VulnerabilitiesApi>({
    id: 'plugin.vulnerabilities'
});

export interface VulnerabilitiesApi {
    fetchVulnerabilitiesFromCatalogEntities(): Promise<RepoVulnerability[]>,
    fetchVulnerabititiesFromRepository(location: string): Promise<RepoVulnerability | null>
}