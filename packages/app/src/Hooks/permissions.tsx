import { identityApiRef, useApi } from '@backstage/core-plugin-api';

export function usePermissionsCheck() {

  const user = JSON.parse(JSON.stringify(useApi(identityApiRef)))

  const validUser = user.target.config.identityApi?.identity?.ownershipEntityRefs[1]?.toString().split(":", 2)[1]

  return validUser ? validUser : "default/builder"
}