import React from 'react';

import {
  configApiRef,
  IdentityApi,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';

import { githubProvider, gitlabProvider, keycloakProvider } from '../../api';
import { SignInPage } from './SigninPage';

export const VeeCodeSignInPage: any = (props: SignInPageProps) => {
  const config = useApi(configApiRef);
  const guest = config.getBoolean('platform.guest.enabled');
  const signInProviders = config.getStringArray('platform.signInProviders');
  const demoGuest = config.getOptionalBoolean('platform.guest.demo');
  const providers: Array<
    typeof githubProvider | typeof keycloakProvider | typeof gitlabProvider
  > = [];
  if (signInProviders && signInProviders.length > 0) {
    signInProviders.forEach(provider => {
      if (provider === 'keycloak') {
        providers.push(keycloakProvider);
      } else if (provider === 'github') {
        providers.push(githubProvider);
      } else if (provider === 'gitlab') {
        providers.push(gitlabProvider);
      }
    });
  }

  let signInProvidersList: (
    | 'guest'
    | 'custom'
    | typeof githubProvider
    | typeof keycloakProvider
    | typeof gitlabProvider
  )[] = [];
  if (guest) {
    if (demoGuest) {
      signInProvidersList = [...providers, 'guest'];
    } else {
      signInProvidersList = ['guest'];
    }
  } else {
    signInProvidersList = providers;
  }

  return (
    <SignInPage
      providers={signInProvidersList as any}
      onSignInSuccess={async (identityApi: IdentityApi) => {
        props.onSignInSuccess(identityApi);
      }}
    />
  );
};
