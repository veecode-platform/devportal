import { createBackendModule } from '@backstage/backend-plugin-api';
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
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          providerId: 'github',
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            async signInResolver(_info, ctx) {
                /*const { 
                    result: {
                        fullProfile: {
                            username,
                            displayName
                        }
                    }
                 } = info;*/

                const userEntity = stringifyEntityRef({
                    kind: 'user',
                    name: "github-guest", //username || displayName,
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