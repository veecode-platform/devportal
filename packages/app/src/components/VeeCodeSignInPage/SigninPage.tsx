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

import React, { ComponentType, ReactNode, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Content,
  Header,
  InfoCard,
  Page,
  Progress,
} from '@backstage/core-components';
import {
  BackstageIdentityResponse,
  configApiRef,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@mui/material/styles';
import { useMountEffect } from '@react-hookz/web';

import { coreComponentsTranslationRef } from '../translation/translation';
import BackstageLogo from './assets/backstage.png';
import { Logo } from './plataformLogo/plataformLogo';
import { getSignInProviders, useSignInProviders } from './providers';
import { GridItem, useStyles } from './styles';
import { IdentityProviders, SignInProviderConfig } from './types';
import { UserIdentity } from './UserIdentity';

type CommonSignInPageProps = SignInPageProps & {
  /**
   * Error component to be rendered instead of the default error panel in case
   * sign in fails.
   */
  ErrorComponent?: ComponentType<{ error?: Error }>;
};

type MultiSignInPageProps = CommonSignInPageProps & {
  providers: IdentityProviders;
  title?: string;
  titleComponent?: ReactNode;
  align?: 'center' | 'left';
};

type SingleSignInPageProps = CommonSignInPageProps & {
  provider: SignInProviderConfig;
  auto?: boolean;
};

export type Props = MultiSignInPageProps | SingleSignInPageProps;

const LogoRender = ({
  base64Logo,
  defaultLogo,
  width,
}: {
  base64Logo: string | undefined;
  defaultLogo: React.JSX.Element;
  width: string | number;
}) => {
  return base64Logo ? (
    <img
      data-testid="home-logo"
      src={base64Logo}
      alt="Home logo"
      width={width}
    />
  ) : (
    defaultLogo
  );
};

const SignInPageLogo = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const configApi = useApi(configApiRef);
  const logoFullBase64URI = configApi.getOptionalString(
    'app.branding.fullLogo',
  );
  const logoFullDarkBase64URI = configApi.getOptionalString(
    'app.branding.fullLogoDark',
  );
  // eslint-disable-next-line no-console
  console.log(theme.palette.mode);

  const fullLogoWidth = configApi
    .getOptional('app.branding.fullLogoWidth')
    ?.toString();

  return (
    <LogoRender
      base64Logo={!isDarkMode ? logoFullDarkBase64URI : logoFullBase64URI}
      defaultLogo={<Logo />}
      width={fullLogoWidth ?? 380}
    />
  );
};

const HeaderComponent = () => {
  const classes = useStyles();
  return (
    <Grid className={classes.logo}>
      <SignInPageLogo />
    </Grid>
  );
};

const FooterComponent = () => {
  const classes = useStyles();
  return (
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
  );
};

export const MultiSignInPage = ({
  onSignInSuccess,
  providers = [],
}: MultiSignInPageProps) => {
  const classes = useStyles();

  const signInProviders = getSignInProviders(providers);
  const [loading, providerElements] = useSignInProviders(
    signInProviders,
    onSignInSuccess,
  );

  if (loading) {
    return <Progress />;
  }

  return (
    <Page themeId="home">
      <Content className={classes.wrapper}>
        <HeaderComponent />
        <Grid
          container
          justifyContent="center"
          component="ul"
          classes={classes}
          lg={4}
          md={6}
          sm={8}
          xs={12}
        >
          {providerElements}
        </Grid>
        <FooterComponent />
      </Content>
    </Page>
  );
};

export const SingleSignInPage = ({
  provider,
  auto,
  onSignInSuccess,
  ErrorComponent,
}: SingleSignInPageProps) => {
  const classes = useStyles();
  const authApi = useApi(provider.apiRef);
  const configApi = useApi(configApiRef);
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  const [error, setError] = useState<Error>();

  // The SignIn component takes some time to decide whether the user is logged-in or not.
  // showLoginPage is used to prevent a glitch-like experience where the sign-in page is
  // displayed for a split second when the user is already logged-in.
  const [showLoginPage, setShowLoginPage] = useState<boolean>(false);

  // User was redirected back to sign in page with error from auth redirect flow
  const [searchParams, _setSearchParams] = useSearchParams();
  const errorParam = searchParams.get('error');

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
      if (!identityResponse && (showPopup || auto) && !errorParam) {
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

  useMountEffect(() => {
    if (errorParam) {
      setError(new Error(errorParam));
    }
    login({ checkExisting: true });
  });

  return showLoginPage ? (
    <Page themeId="home">
      <Header title={configApi.getString('app.title')} />
      <Content>
        <Grid
          container
          justifyContent="center"
          spacing={2}
          component="ul"
          classes={classes}
        >
          <GridItem>
            <InfoCard
              variant="fullHeight"
              title={provider.title}
              actions={
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    login({ showPopup: true });
                  }}
                >
                  {t('signIn.title')}
                </Button>
              }
            >
              <Typography variant="body1">{provider.message}</Typography>
              {error &&
                error.name !== 'PopupRejectedError' &&
                (ErrorComponent ? (
                  <ErrorComponent error={error} />
                ) : (
                  <Typography variant="body1" color="error">
                    {error.message}
                  </Typography>
                ))}
            </InfoCard>
          </GridItem>
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
