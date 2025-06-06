/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import {
  ProviderComponent,
  ProviderLoader,
  SignInProvider,
  SignInProviderConfig,
} from './types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { GridItem, useStyles } from './styles';
import { ForwardedError } from '@backstage/errors';
import { UserIdentity } from '@backstage/core-components';
import Grid from '@material-ui/core/Grid';
import { coreComponentsTranslationRef } from '../translation/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

const Component: ProviderComponent = ({
  config,
  onSignInStarted,
  onSignInSuccess,
  onSignInFailure,
}) => {
  const { apiRef, title, message } = config as SignInProviderConfig;
  const authApi = useApi(apiRef);
  const errorApi = useApi(errorApiRef);
  const classes = useStyles();
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  const handleLogin = async () => {
    try {
      onSignInStarted();
      const identityResponse = await authApi.getBackstageIdentity({
        instantPopup: true,
      });
      if (!identityResponse) {
        onSignInFailure();
        throw new Error(
          `The ${title} provider is not configured to support sign-in`,
        );
      }

      const profile = await authApi.getProfile();

      onSignInSuccess(
        UserIdentity.create({
          identity: identityResponse.identity,
          profile,
          authApi,
        }),
      );
    } catch (error) {
      onSignInFailure();
      errorApi.post(new ForwardedError(t('signIn.loginFailed'), error));
    }
  };

  return (
    <GridItem>
      <Grid className={classes.loginBox} onClick={handleLogin}>
        <div className={classes.providerTitleBar}>
          <img
            src={require(`./assets/${title.toLowerCase()}.png`)}
            alt={title}
            className={classes.providerLogo}
          />
          <h3>{message}</h3>
        </div>
      </Grid>
    </GridItem>
  );
};

const loader: ProviderLoader = async (apis, apiRef) => {
  const authApi = apis.get(apiRef)!;

  const identityResponse = await authApi.getBackstageIdentity({
    optional: true,
  });

  if (!identityResponse) {
    return undefined;
  }

  const profile = await authApi.getProfile();

  return UserIdentity.create({
    identity: identityResponse.identity,
    profile,
    authApi,
  });
};

export const commonProvider: SignInProvider = { Component, loader };
