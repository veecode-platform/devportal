/* eslint-disable react/forbid-elements */
/*
 * Copyright 2023 The Backstage Authors
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
import {
  BackstageIdentityResponse,
  // configApiRef,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';
import { UserIdentity } from './UserIdentity';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useMountEffect } from '@react-hookz/web';
import { Progress } from '@backstage/core-components';
import { Content } from '@backstage/core-components';
import { Page } from '@backstage/core-components';
import { getSignInProviders, useSignInProviders } from './providers';
import { GridItem, useStyles } from './styles';
import { IdentityProviders, SignInProviderConfig } from './types';
import { Logo } from './plataformLogo/plataformLogo';
import BackstageLogo from "./assets/backstage.png";
import KeycloakLogo from "./assets/keycloak.png";
import OktaLogo from "./assets/okta.png";
import GithubLogo from "./assets/github.png";
import GitlabLogo from "./assets/gitlab.png"
import { coreComponentsTranslationRef } from '../translation/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

type MultiSignInPageProps = SignInPageProps & {
  providers: IdentityProviders;
  title?: string;
  align?: 'center' | 'left';
};

type SingleSignInPageProps = SignInPageProps & {
  provider: SignInProviderConfig;
  auto?: boolean;
};

export type Props = MultiSignInPageProps | SingleSignInPageProps;

export const MultiSignInPage = ({
  onSignInSuccess,
  providers = [],
  // title,
  // align = 'left',
}: MultiSignInPageProps) => {
  // const configApi = useApi(configApiRef);
  const classes = useStyles();

  const signInProviders = getSignInProviders(providers);
  const [loading, providerElements] = useSignInProviders(
    signInProviders,
    onSignInSuccess,
  );

  if (loading) {
    return <Progress />;
  }

  console.log(providerElements)

  return (
    <Page themeId="home">
      {/* <Header title={configApi.getString('app.title')} /> */}
      <Content className={classes.wrapper}>
        {/* {title && <ContentHeader title={title} textAlign={align} />} */}
        <Grid  className={classes.logo}>
            <Logo/>
        </Grid>
        <Grid
            container
            justifyContent="center"
            //spacing={1}
            component="ul"
            lg={4}
            md={6}
            sm={8}
            xs={12}
          >
           {!Array.isArray(providerElements) ? providerElements: 
                    providerElements.map((provider, index) => (
                      <div key={index} className={classes.providerItem}>
                        {provider.key?.includes("keycloak") && (
                          <img
                            src={KeycloakLogo}
                            alt={provider.key}
                            className={classes.providerLogo}
                          />
                        )}
                        {provider.key?.includes("okta") && (
                          <img
                            src={OktaLogo}
                            alt={provider.key}
                            className={classes.providerLogo}
                          />
                        )}
                        {provider.key?.includes("github") && (
                          <img
                            src={GithubLogo}
                            alt={provider.key}
                            className={classes.providerLogo}
                          />
                        )}
                        {provider.key?.includes("gitlab") && (
                          <img
                            src={GitlabLogo}
                            alt={provider.key}
                            className={classes.providerLogo}
                          />
                        )}
                        <h3>{provider.props.config.message}</h3>
                      </div>
                    )
           )}
        </Grid>
        <Grid item className={classes.footerWrapper} lg={12}>
              <p className={classes.footer}>
                {' '}
                <span className={classes.footerText}>Powered by </span>{' '}
                <img
                  src={BackstageLogo}
                  alt="backstage logo"
                  className={classes.logoBackstage}
                />{' '}
              </p>
        </Grid>
      </Content>
    </Page>
  );
};

export const SingleSignInPage = ({
  provider,
  auto,
  onSignInSuccess,
}: SingleSignInPageProps) => {
  const classes = useStyles();
  const authApi = useApi(provider.apiRef);
  // const configApi = useApi(configApiRef);
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  const [error, setError] = useState<Error>();

  // The SignIn component takes some time to decide whether the user is logged-in or not.
  // showLoginPage is used to prevent a glitch-like experience where the sign-in page is
  // displayed for a split second when the user is already logged-in.
  const [showLoginPage, setShowLoginPage] = useState<boolean>(false);

  type LoginOpts = { checkExisting?: boolean; showPopup?: boolean };
  const login = async ({ checkExisting, showPopup }: LoginOpts) => {
    try {
      let identityResponse: BackstageIdentityResponse | undefined;
      if (checkExisting) {
        // Do an initial check if any logged-in session exists
        identityResponse = await authApi.getBackstageIdentity({
          optional: true,
        });
      }

      // If no session exists, show the sign-in page
      if (!identityResponse && (showPopup || auto)) {
        // Unless auto is set to true, this step should not happen.
        // When user intentionally clicks the Sign In button, autoShowPopup is set to true
        setShowLoginPage(true);
        identityResponse = await authApi.getBackstageIdentity({
          instantPopup: true,
        });
        if (!identityResponse) {
          throw new Error(
            `The ${provider.title} provider is not configured to support sign-in`,
          );
        }
      }

      if (!identityResponse) {
        setShowLoginPage(true);
        return;
      }

      const profile = await authApi.getProfile();
      onSignInSuccess(
        UserIdentity.create({
          identity: identityResponse.identity,
          authApi,
          profile,
        }),
      );
    } catch (err: any) {
      // User closed the sign-in modal
      setError(err);
      setShowLoginPage(true);
    }
  };

  useMountEffect(() => login({ checkExisting: true }));

  return showLoginPage ? (
    <Page themeId="home">
      {/* <Header title={configApi.getString('app.title')} /> */}
        <Content className={classes.wrapper}>
          <Grid  className={classes.logo}>
              <Logo />
          </Grid>
          <Grid
            container
            justifyContent="center"
            spacing={2}
            component="ul"
            classes={classes}
          >
            <GridItem>
              <Grid
                className={classes.loginBox}
                onClick={() => {
                  login({ showPopup: true });
                }}
              >
                <div className={classes.providerTitleBar}>
                  {provider.title.includes("Keycloak") && <img src={KeycloakLogo} alt={provider.title} className={classes.providerLogo}/>}
                  {provider.title.includes("Okta") && <img src={OktaLogo} alt={provider.title} className={classes.providerLogo} />}
                  {provider.title.includes("GitHub") && <img src={GithubLogo} alt={provider.title} className={classes.providerLogo} />}
                  {provider.title.includes("Gitlab") && <img src={GitlabLogo} alt={provider.title} className={classes.providerLogo} />}
                  <h3>{provider.message}</h3>
                </div>
                {error && error.name !== 'PopupRejectedError' && (
                  <Typography variant="body1" color="error">
                    {error.message}
                  </Typography>
                )}
              </Grid>
            </GridItem>
          </Grid>
          <Grid item className={classes.footerWrapper} lg={12}>
                <p className={classes.footer}>
                  {' '}
                  <span className={classes.footerText}>Powered by </span>{' '}
                  <img
                    src={BackstageLogo}
                    alt="backstage logo"
                    className={classes.logoBackstage}
                  />{' '}
                </p>
              </Grid>
        </Content>
    </Page>
  ) : (
    <Progress />
  );
};

export function SignInPage(props: Props) {
  if ('provider' in props) {
    return <SingleSignInPage {...props} />;
  }

  return <MultiSignInPage {...props} />;
}
