import { identityApiRef, useApi } from '@backstage/core-plugin-api';

export function usePermissionsCheck() {

  const user = JSON.parse(JSON.stringify(useApi(identityApiRef)))

  const validUser = user.target.config.identityApi?.identity?.ownershipEntityRefs[1]?.toString().split(":", 2)[1]

  return validUser ? validUser : "default/builder"
}

/* todo change json stringify to getString
https://backstage.io/docs/auth/#sign-in-with-proxy-providers
const configApi = useApi(configApiRef);
      if (configApi.getString('auth.environment') === 'development') {*/