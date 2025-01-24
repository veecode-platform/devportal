import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  analyticsApiRef,
  ApiRef,
  BackstageIdentityApi,
  configApiRef,
  createApiFactory,
  createApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
  OpenIdConnectApi,
  ProfileInfoApi,
  SessionApi,
  identityApiRef,
  errorApiRef,
  fetchApiRef
} from '@backstage/core-plugin-api';
import { OAuth2 } from '@backstage/core-app-api';
// google analytics
import { GoogleAnalytics4 } from '@backstage-community/plugin-analytics-module-ga4';
import { VisitsWebStorageApi, visitsApiRef } from '@backstage/plugin-home';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { ScaffolderClient } from '@backstage/plugin-scaffolder';

export const oidcAuthApiRef: ApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'auth.oidc-provider',
});

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
  createApiFactory({
    api: oidcAuthApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        oauthRequestApi: oauthRequestApiRef,
        configApi: configApiRef,
      },
      factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
        OAuth2.create({
          discoveryApi,
          oauthRequestApi,
          configApi,
          provider: {
            id: 'oidc',
            title: 'Default keycloak authentication provider',
            icon: () => null,
          },
          environment: configApi.getOptionalString('auth.environment'),
          defaultScopes: [
            'openid',
            'profile',
            'email',
          ],
        }),
    }),
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, identityApi: identityApiRef },
    factory: ({ configApi, identityApi }) =>
      GoogleAnalytics4.fromConfig(configApi, {
        identityApi,
      }),
  }),
  createApiFactory({
    api: visitsApiRef,
    deps: {
      identityApi: identityApiRef,
      errorApi: errorApiRef
    },
    factory: ({ identityApi, errorApi }) => VisitsWebStorageApi.create({ identityApi, errorApi }),
  }),
  createApiFactory({
    api: scaffolderApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      identityApi: identityApiRef,
      scmIntegrationsApi: scmIntegrationsApiRef,
      fetchApi: fetchApiRef,
    },
    factory: ({ scmIntegrationsApi, discoveryApi, identityApi, fetchApi }) =>
      new ScaffolderClient({
        discoveryApi,
        identityApi,
        scmIntegrationsApi,
        fetchApi,
        useLongPollingLogs: true,
      }),
  })
];

