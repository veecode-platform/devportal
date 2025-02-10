import { createBackendModule, coreServices } from '@backstage/backend-plugin-api';
import { stringifyEntityRef/*, DEFAULT_NAMESPACE*/ } from '@backstage/catalog-model';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';

export const customGithubAuthProvider = createBackendModule({
  pluginId: 'auth',
  moduleId: 'custom-github-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint, config: coreServices.rootConfig },
      async init({ providers, config }) {
        providers.registerProvider({
          providerId: 'github',
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,

            async signInResolver(info, ctx) {
              const demoGuestMode = config.getOptionalBoolean('platform.guest.demo');

                const { 
                    result: {
                        fullProfile: {
                            username,
                            displayName
                        }
                    }
                 } = info;

                const userEntity = stringifyEntityRef({
                    kind: 'user',
                    name: demoGuestMode ? "github-guest" : username || displayName,
                });
              
                return ctx.issueToken({
                    claims: {
                      sub: userEntity,
                      ent: [userEntity],
                    },
                  });
            },
          }),
        });
      },
    });
  },
});