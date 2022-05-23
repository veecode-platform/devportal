import { identityApiRef, useApi } from '@backstage/core-plugin-api';

export function usePermissionsCheck() {

  const user = JSON.parse(JSON.stringify(useApi(identityApiRef)))

  //console.log("LOG ->>>> ", user.target.config.identityApi.identity.ownershipEntityRefs[1].toString().split(":", 2)[1])
  
  //return "admin"
  return (user.target.config.identityApi.identity.ownershipEntityRefs[1].toString().split(":", 2)[1])
}


;