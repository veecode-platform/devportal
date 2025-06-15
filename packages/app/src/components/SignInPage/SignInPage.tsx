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
