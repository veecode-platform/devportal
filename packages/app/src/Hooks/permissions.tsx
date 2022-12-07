import { identityApiRef, useApi } from '@backstage/core-plugin-api';


/*export function usePermissionsCheck() {
  const user = useApi(identityApiRef);
  const validUser = await user.getBackstageIdentity()
  return validUser.userEntityRef.split(":")[0]  
}*/
export function usePermissionsCheck() {
  const user = useApi(identityApiRef);
  const validUser = JSON.parse(JSON.stringify(user)).target.config.identityApi.identity.userEntityRef.split(":")[0]
  return validUser
}
