import { createBackendModule, coreServices } from '@backstage/backend-plugin-api';
import { stringifyEntityRef/*, DEFAULT_NAMESPACE*/ } from '@backstage/catalog-model';
import { githubAuthenticator, githubSignInResolvers } from '@backstage/plugin-auth-backend-module-github-provider';
import {
  authProvidersExtensionPoint,
  commonSignInResolvers,
  createOAuthProviderFactory,
  createSignInResolverFactory,
  OAuthAuthenticatorResult,
  PassportProfile,
  SignInInfo,
} from '@backstage/plugin-auth-node';

export const customGithubAuthProvider = createBackendModule({
  pluginId: 'auth',
  moduleId: 'github-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint, config: coreServices.rootConfig },
      async init({ providers }) {
        providers.registerProvider({
          providerId: 'github',
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            signInResolverFactories: {
              ...githubSignInResolvers,
              ...commonSignInResolvers,
              usernameDefaultGuest

            }
          }),
        });
      },
    });
  },
});


export const usernameDefaultGuest = createSignInResolverFactory({
  create() {
    return async (
      info: SignInInfo<OAuthAuthenticatorResult<PassportProfile>>,
      ctx,
    ) => {
      const { fullProfile } = info.result;

      const userId = fullProfile.username;
      if (!userId) {
        throw new Error(`GitHub user profile does not contain a username`);
      }

      const userEntity = stringifyEntityRef({
        kind: 'user',
        name: userId,
      });

      return ctx.issueToken({
        claims: {
          sub: userEntity,
          ent: [userEntity, 'group:default/guest'],
        },
      });

    };
  },
});
