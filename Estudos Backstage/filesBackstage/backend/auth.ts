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

import { DEFAULT_NAMESPACE, stringifyEntityRef } from '@backstage/catalog-model';
import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,

      // NOTE: DO NOT add this many resolvers in your own instance!
      //       It is important that each real user always gets resolved to
      //       the same sign-in identity. The code below will not do that.
      //       It is here for demo purposes only.
      github: providers.github.create({
        signIn: {
          resolver: providers.github.resolvers.usernameMatchingUserEntityName(),
        },
      }),
      gitlab: providers.gitlab.create({
        signIn: {
          async resolver({ result: { fullProfile } }, ctx) {
            return ctx.signInWithCatalogUser({
              entityRef: {
                name: fullProfile.id,
              },
            });
          },
        },
      }),
      microsoft: providers.microsoft.create({
        signIn: {
          resolver:
            providers.microsoft.resolvers.emailMatchingUserEntityAnnotation(),
        },
      }),
      google: providers.google.create({
        signIn: {
          resolver:
            providers.google.resolvers.emailLocalPartMatchingUserEntityName(),
        },
      }),
      okta: providers.okta.create({
        signIn: {
          resolver:async ({ profile }, ctx) => {
            if (!profile.email) {
              throw new Error(
                'Login failed, user profile does not contain an email',
              );
            }
            // We again use the local part of the email as the user name.
            const [localPart] = profile.email.split('@');
          
            // By using `stringifyEntityRef` we ensure that the reference is formatted correctly
            const userEntityRef = stringifyEntityRef({
              kind: 'User',
              name: localPart,
              namespace: DEFAULT_NAMESPACE,
            });
          
            return ctx.issueToken({
              claims: {
                sub: userEntityRef,
                ent: [userEntityRef],
              },
            });
          },
        },
      }),
      bitbucket: providers.bitbucket.create({
        signIn: {
          resolver:
            providers.bitbucket.resolvers.usernameMatchingUserEntityAnnotation(),
        },
      }),
      onelogin: providers.onelogin.create({
        signIn: {
          async resolver({ result: { fullProfile } }, ctx) {
            return ctx.signInWithCatalogUser({
              entityRef: {
                name: fullProfile.id,
              },
            });
          },
        },
      }),
    },
  });
}
