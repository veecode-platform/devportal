import {
    AuthService,
    BackstageCredentials,
  } from '@backstage/backend-plugin-api';
  import { ClusterDetails, KubernetesClustersSupplier } from '@backstage/plugin-kubernetes-node'
  import { CATALOG_FILTER_EXISTS, CatalogApi } from '@backstage/catalog-client';
  import {
    ANNOTATION_KUBERNETES_API_SERVER,
    ANNOTATION_KUBERNETES_API_SERVER_CA,
    ANNOTATION_KUBERNETES_AUTH_PROVIDER,
    ANNOTATION_KUBERNETES_SKIP_METRICS_LOOKUP,
    ANNOTATION_KUBERNETES_SKIP_TLS_VERIFY,
    ANNOTATION_KUBERNETES_DASHBOARD_URL,
    ANNOTATION_KUBERNETES_DASHBOARD_APP,
    ANNOTATION_KUBERNETES_DASHBOARD_PARAMETERS,
  } from '@backstage/plugin-kubernetes-common';
  import { JsonObject } from '@backstage/types';

  export interface VeecodeClusterDetails extends ClusterDetails {
    secretName: string,
    namespace: string
  }

  function isObject(obj: unknown): obj is JsonObject {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
  }
  
  export class VeecodeCatalogClusterLocator implements KubernetesClustersSupplier {
    private catalogClient: CatalogApi;
    private auth: AuthService;
  
    constructor(catalogClient: CatalogApi, auth: AuthService) {
      this.catalogClient = catalogClient;
      this.auth = auth;
    }
  
    static fromConfig(
      catalogApi: CatalogApi,
      auth: AuthService,
    ): VeecodeCatalogClusterLocator {
      return new VeecodeCatalogClusterLocator(catalogApi, auth);
    }
  
    async getClusters(options?: {
      credentials: BackstageCredentials;
    }): Promise<ClusterDetails[]> {

      const apiServerKey = `metadata.annotations.${ANNOTATION_KUBERNETES_API_SERVER}`;
      //const apiServerCaKey = `metadata.annotations.${ANNOTATION_KUBERNETES_API_SERVER_CA}`;
      const authProviderKey = `metadata.annotations.${ANNOTATION_KUBERNETES_AUTH_PROVIDER}`;
  
      const filter: Record<string, symbol | string> = {
        kind: 'Cluster',
        //'spec.type': 'kubernetes-cluster',
        [apiServerKey]: CATALOG_FILTER_EXISTS,
        //[apiServerCaKey]: CATALOG_FILTER_EXISTS,
        [authProviderKey]: CATALOG_FILTER_EXISTS,
      };

      const clusters = await this.catalogClient.getEntities(
        {
          filter: [filter],
        },
        options?.credentials
          ? {
              token: (
                await this.auth.getPluginRequestToken({
                  onBehalfOf: options.credentials,
                  targetPluginId: 'catalog',
                })
              ).token,
            }
          : undefined,
      );
      return clusters.items.map(entity => {
        const annotations = entity.metadata.annotations!;
        const clusterDetails: VeecodeClusterDetails = {
          name: entity.metadata.name,
          secretName: annotations["kubernetes.io/secret-name"],
          namespace: annotations["kubernetes.io/secret-namespace"],
          title: entity.metadata.title,
          url: annotations[ANNOTATION_KUBERNETES_API_SERVER],
          authMetadata: annotations,
          caData: annotations[ANNOTATION_KUBERNETES_API_SERVER_CA],
          skipMetricsLookup:
            annotations[ANNOTATION_KUBERNETES_SKIP_METRICS_LOOKUP] === 'true', 
          skipTLSVerify:
            annotations[ANNOTATION_KUBERNETES_SKIP_TLS_VERIFY] === 'true',
          dashboardUrl: annotations[ANNOTATION_KUBERNETES_DASHBOARD_URL],
          dashboardApp: annotations[ANNOTATION_KUBERNETES_DASHBOARD_APP],
          dashboardParameters: this.getDashboardParameters(annotations),
        };
        console.log("ADDED NEW CLUSTER:", clusterDetails.name)
        return clusterDetails;
      });
    }
  
    private getDashboardParameters(
      annotations: Record<string, string>,
    ): JsonObject | undefined {
      const dashboardParamsString =
        annotations[ANNOTATION_KUBERNETES_DASHBOARD_PARAMETERS];
      if (dashboardParamsString) {
        try {
          const dashboardParams = JSON.parse(dashboardParamsString);
          return isObject(dashboardParams) ? dashboardParams : undefined;
        } catch {
          return undefined;
        }
      }
      return undefined;
    }
  }

  