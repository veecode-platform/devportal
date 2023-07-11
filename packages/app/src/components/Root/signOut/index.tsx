import React, { useState } from 'react';
import { SidebarItem } from '@backstage/core-components';
import SignOutIcon from '@material-ui/icons/MeetingRoom';
import { configApiRef, identityApiRef, useApi } from '@backstage/core-plugin-api';


const SignOutElement = () => {

  const identityApi = useApi(identityApiRef);
  const config = useApi(configApiRef);
  const providersConfig = config.getOptionalConfig('auth.providers');
  const configuredProviders = providersConfig?.keys() || [];
  const [loading, setLoading] = useState(false)

  const handleSessionLogout = async () => {
    setLoading(true)
    const token = await identityApi.getCredentials();
    const backendBaseUrl = config.getConfig('backend').get('baseUrl');
    if (configuredProviders.includes('keycloak')) {
      await fetch(`${backendBaseUrl}/api/devportal/keycloak/logout`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token.token}` }
      })
    }
    // add new providers as they are used
  }

  return (
    <SidebarItem
      icon={SignOutIcon} 
      text="Sign Out"
      onClick={async () => {
        if(loading) return 
        if (!config.getBoolean('platform.guest.enabled')) { await handleSessionLogout() }
        identityApi.signOut();
      }} />
  )
}

export default SignOutElement