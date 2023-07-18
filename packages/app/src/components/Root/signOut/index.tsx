import React, { useState } from 'react';
import { SidebarItem } from '@backstage/core-components';
import SignOutIcon from '@material-ui/icons/MeetingRoom';
import { configApiRef, identityApiRef, useApi, errorApiRef } from '@backstage/core-plugin-api';
import { keycloakOIDCAuthApiRef } from '../../../apis';

const SignOutElement = () => {

  const identityApi = useApi(identityApiRef);
  const keycloakApi = useApi(keycloakOIDCAuthApiRef)
  const config = useApi(configApiRef);
  const errorApi = useApi(errorApiRef)
  const [loading, setLoading] = useState(false)

  const handleKeycloakSessionLogout = async () => {
    try {
      setLoading(true)
      const keycloakMetadataUrl = config.getOptionalString("auth.providers.keycloak.development.metadataUrl") ?? ""
      const keycloakClientId = config.getOptionalString("auth.providers.keycloak.development.clientId") ?? ""
      const appBaseUrl = config.getString("app.baseUrl")
      const keycloakLogoutUrl = (await (await fetch(keycloakMetadataUrl)).json()).end_session_endpoint
      const keycloakIdToken = await keycloakApi.getIdToken()
      window.open(`${keycloakLogoutUrl}?post_logout_redirect_uri=${appBaseUrl}&id_token_hint=${keycloakIdToken}&client_id=${keycloakClientId}`, "_self")
    }
    catch (e: any) { errorApi.post(e) }
  }

  return (
    <SidebarItem
      icon={SignOutIcon}
      text="Sign Out"
      onClick={async () => {
        if (loading) return
        if (config.getBoolean('platform.guest.enabled')) await identityApi.signOut()
        await handleKeycloakSessionLogout()
      }} />
  )
}

export default SignOutElement