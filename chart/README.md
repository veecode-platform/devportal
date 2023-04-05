# Veecode Platform Devportal

## Adding Platform repository

```sh
helm repo add veecode-platform https://veecode-platform.github.io/public-charts/
helm repo update
```

## Installing chart

```sh
helm install platform-devportal --values ./values-demo.yaml veecode-platform/devportal
```

## Removing chart

```sh
helm uninstall platform-devportal
```

---

## Platform Devportal Chart Values

| Name                                                      | Description                                                  | Value          |
| --------------------------------------------------------- | ------------------------------------------------------------ | -------------- |
| `replicas`                                                | The number of replicas to create                             | 1              |
| `image.repository`                                        | The Devportal image repository                               | ""             |
| `image.tag`                                               | Overrides the Devportal image tag whose default is `latest`. | "latest"       |
| `image.pullPolicy`                                        | The Devportal image pull policy                              | "IfNotPresent" |
| `environment`                                             | Set application environment                                  | "development"  |
| `service.enabled`                                         | If `true`, an service is created                             | false          |
| `service.type`                                            | The Service type                                             | "ClusterIP"    |
| `service.containerPort`                                   | The Service port                                             | 7007           |
| `ingress.enabled`                                         | If `true`, an ingress is created                             | false          |
| `ingress.host`                                            | Ingress Host                                                 | ""             |
| `ingress.path`                                            | Ingress TLS Secret Name                                      | ""             |
| `ingress.tls.secretName`                                  | Ingress Class Name                                           | ""             |
| `ingress.className`                                       | The name of the Ingress Class associated with the ingress    | ""             |
| `resources.requests.memory`                               | Resource requests for pod Memory                             | ""             |
| `resources.requests.cpu`                                  | Resource requests for pod CPU                                | ""             |
| `resources.limits.memory`                                 | Resource limits for pod Memory                               | ""             |
| `resources.limits.cpu`                                    | Resource limits for pod CPU                                  | ""             |
| `appConfig.title`                                         | Devportal title                                              | ""             |
| `appConfig.app.baseUrl`                                   | Platform Devportal Base URL                                  | ""             |
| `appConfig.backend.baseUrl`                               | Platform Devportal Backend Base URL                          | ""             |
| `appConfig.backend.secret`                                | Platform Devportal Backend secret. Random value              | ""             |
| `appConfig.database.client`                               | Database client                                              | "pg"           |
| `appConfig.database.connection.host`                      | Database Host                                                | ""             |
| `appConfig.database.connection.port`                      | Database port number                                         | 5432           |
| `appConfig.database.connection.database`                  | Database Name                                                | ""             |
| `appConfig.database.connection.user`                      | Database Username                                            | ""             |
| `appConfig.database.connection.password`                  | Database Password                                            | ""             |
| `grafana.enabled`                                         | Enable grafana plugin                                        | ""             |
| `grafana.domain`                                          | Grafana domain                                               | ""             |
| `grafana.token`                                           | Grafana token                                                | ""             |
| `argocd.enabled`                                          | Enable ArgoCD plugin                                         | ""             |
| `argocd.domain`                                           | ArgoCD domain                                                | ""             |
| `argocd.username`                                         | ArgoCD username                                              | ""             |
| `argocd.token`                                            | ArgoCD token                                                 | ""             |
| `vault.enabled`                                           | Enable Vault plugin                                          | ""             |
| `vault.domain`                                            | Vault domain                                                 | ""             |
| `vault.token`                                             | Vault token                                                  | ""             |
| `kong.enabled`                                            | Enable Kong integration                                      | ""             |
| `kong.apiManager`                                         | Kong api manager url                                         | ""             |
| `kong.adminToken`                                         | Kong admin token                                             | ""             |
| `auth.providers.keycloak.metadataUrl`                     | Keycloak .well-known url                                     | ""             |
| `auth.providers.keycloak.clientId`                        | Keycloak client id                                           | ""             |
| `auth.providers.keycloak.clientSecret`                    | Keycloak client secret                                       | ""             |
| `auth.providers.keycloak.prompt`                          | Enable Keycloak prompt                                       | ""             |
| `auth.providers.github.clientId`                          | Github Oauth application client id                           | ""             |
| `auth.providers.github.clientSecret`                      | Github Oauth application client secret                       | ""             |
| `integrations.github.host`                                | Github Server Host                                           | ""             |
| `integrations.github.token`                               | Github Token                                                 | ""             |
| `integrations.bitbucketCloud.username`                    | Bitbucket Cloud Username                                     | ""             |
| `integrations.bitbucketCloud.appPassword`                 | Bitbucket Cloud Password                                     | ""             |
| `integrations.bitbucketServer.host`                       | Bitbucket Cloud Host                                         | ""             |
| `integrations.bitbucketServer.apiBaseUrl`                 | Bitbucket Cloud Api Base                                     | ""             |
| `integrations.bitbucketServer.token`                      | Bitbucket Cloud Token                                        | ""             |
| `integrations.gitlab.host`                                | Gitlab Host                                                  | ""             |
| `integrations.gitlab.token`                               | Gitlab Server Token                                          | ""             |
| `catalog.providers.github.organization`                   | Github Organization Name                                     | ""             |
| `catalog.providers.github.catalogPath`                    | Path catalog info                                            | ""             |
| `catalog.providers.github.filters.branch`                 | Which branch to filter                                       | ""             |
| `catalog.providers.github.filters.repository`             | Repository filter pattern                                    | ""             |
| `catalog.providers.github.filters.validateLocationsExist` | Check if exists                                              | ""             |
| `catalog.providers.bitbucketCloud.catalogPath`            | Path catalog info                                            | ""             |
| `catalog.providers.bitbucketCloud.workspace`              | Bitbucket workspace                                          | ""             |
| `catalog.providers.bitbucketCloud.filters.projectKey`     | Bitbucket project key                                        | ""             |
| `catalog.providers.bitbucketCloud.filters.repoSlug`       | Bitbucket repo slug                                          | ""             |
| `catalog.providers.bitbucketServer.host`                  | Bitbucket Server host                                        | ""             |
| `catalog.providers.bitbucketServer.catalogPath`           | Path catalog info                                            | ""             |
| `catalog.providers.bitbucketServer.filters.projectKey`    | Bitbucket project key                                        | ""             |
| `catalog.providers.bitbucketServer.filters.repoSlug`      | Bitbucket repo slug                                          | ""             |
| `catalog.providers.gitlab.host`                           | Gitlab Host                                                  | ""             |
| `catalog.providers.gitlab.branch`                         | Gitlab Branch                                                | ""             |
| `catalog.providers.gitlab.group`                          | Gitlab Group                                                 | ""             |
| `catalog.providers.gitlab.entityFilename`                 | Catalog info file name                                       | ""             |
| `locations.type`                                          | Location Type                                                | ""             |
| `locations.target`                                        | Location Type                                                | ""             |
| `platform.guest.enabled`                                  | Enable Platform guest mode                                   | ""             |
| `platform.apiManagement.enabled`                          | Enable Platform Api management module                        | ""             |
| `kubernetes.type`                                         | Kubernetes type                                              | ""             |
| `kubernetes.url`                                          | Kubernetes url                                               | ""             |
| `kubernetes.name`                                         | Kubernetes name                                              | ""             |
| `kubernetes.authProvider`                                 | Kubernetes auth provider                                     | ""             |
| `kubernetes.skipTLSVerify`                                | Kubernetes skip TLS verification                             | ""             |
| `kubernetes.skipMetricsLookup`                            | Kubernetes skip Metrics Lookup                               | ""             |
| `kubernetes.serviceAccountToken`                          | Kubernetes service Account Token                             | ""             |
| `kubernetes.caData`                                       | Kubernetes certificate Data                                  | ""             |
