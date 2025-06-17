/*
 * Portions of this file are based on code from the Red Hat Developer project:
 * https://github.com/redhat-developer/rhdh/blob/main/packages/app
 *
 * Original Copyright (c) 2022 Red Hat Developer (or the exact copyright holder from the original source, please verify in their repository)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  SignInPage as CCSignInPage,
  ProxiedSignInPage,
  type SignInProviderConfig,
} from '@backstage/core-components';
import {
  configApiRef,
  useApi,
  type SignInPageProps,
} from '@backstage/core-plugin-api';

import { githubProvider, gitlabProvider, keycloakProvider } from '../../api';

const DEFAULT_PROVIDER = 'keycloak';

/**
 * Key:
 * string - Provider name.
 *
 * Value:
 * SignInProviderConfig - Local sign-in provider configuration.
 * string - Proxy sign-in provider configuration.
 */
const PROVIDERS = new Map<string, SignInProviderConfig | string>([
  ['github', githubProvider],
  ['gitlab', gitlabProvider],
  ['keycloak', keycloakProvider],
]);

export function SignInPage(props: SignInPageProps): React.JSX.Element {
  const configApi = useApi(configApiRef);
  const isDevEnv = configApi.getString('auth.environment') === 'development';
  const provider =
    configApi.getOptionalString('signInPage') ?? DEFAULT_PROVIDER;
  const providerConfig =
    PROVIDERS.get(provider) ?? PROVIDERS.get(DEFAULT_PROVIDER)!;

  if (typeof providerConfig === 'object') {
    const providers = isDevEnv
      ? (['guest', providerConfig] satisfies ['guest', SignInProviderConfig])
      : [providerConfig];

    return (
      <CCSignInPage
        {...props}
        title="Select a sign-in method"
        align="center"
        providers={providers}
      />
    );
  }

  return <ProxiedSignInPage {...props} provider={providerConfig} />;
}
