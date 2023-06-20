import React from 'react';
import { SidebarItem } from '@backstage/core-components';
import SignOutIcon from '@material-ui/icons/MeetingRoom';
import { SessionState, configApiRef, githubAuthApiRef, gitlabAuthApiRef, identityApiRef, oktaAuthApiRef, useApi } from '@backstage/core-plugin-api';
import { keycloakOIDCAuthApiRef } from '../../../apis';


const SignUpElement = () => {

  const identityApi = useApi(identityApiRef);
  const config = useApi(configApiRef);
  const providersConfig = config.getOptionalConfig('auth.providers');
  const configuredProviders = providersConfig?.keys() || [];
  const gitlab = useApi(gitlabAuthApiRef);
  const github = useApi(githubAuthApiRef);
  const okta = useApi(oktaAuthApiRef);
  const keycloak = useApi(keycloakOIDCAuthApiRef);

  const handleSessionLogout = async () => { 
        if (configuredProviders.includes('keycloak')){
            const status = keycloak.sessionState$();
            status.subscribe((sessionState) => {
            const sessionStateString = sessionState === SessionState.SignedIn ? "SignedIn" : "SignedOut";
            if (sessionStateString === SessionState.SignedIn) keycloak.signOut() 
        });
        }

        if (configuredProviders.includes('okta')){
            const status = okta.sessionState$();
            status.subscribe((sessionState) => {
            const sessionStateString = sessionState === SessionState.SignedIn ? "SignedIn" : "SignedOut";
            if (sessionStateString === SessionState.SignedIn) okta.signOut() 
            });
        }

        if (configuredProviders.includes('github')){
            const status = github.sessionState$();
            status.subscribe((sessionState) => {
            const sessionStateString = sessionState === SessionState.SignedIn ? "SignedIn" : "SignedOut";
            if (sessionStateString === SessionState.SignedIn) github.signOut() 
            });
        }
        if (configuredProviders.includes('gitlab')){
            const status = gitlab.sessionState$();
            status.subscribe((sessionState) => {
            const sessionStateString = sessionState === SessionState.SignedIn ? "SignedIn" : "SignedOut";
            if (sessionStateString === SessionState.SignedIn) gitlab.signOut() 
            });
        }
    }

  return (
    <SidebarItem
     icon={SignOutIcon} 
     text="Sign Out" 
     onClick={async () => {
            if (!config.getBoolean('platform.guest.enabled')) {await handleSessionLogout()}
            identityApi.signOut()
            }}/>
  )
}

export default SignUpElement