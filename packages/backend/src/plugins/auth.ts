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
// import { createOktaProvider, getDefaultOwnershipEntityRefs } from '@backstage/plugin-auth-backend';
import { stringifyEntityRef } from '@backstage/catalog-model';

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
      //github: providers.github.create({
      //  signIn: {
      //    resolver: providers.github.resolvers.usernameMatchingUserEntityName(),
      //  },
      //}),

      okta: providers.okta.create({
        signIn:{
          resolver: async ({profile, result}, ctx) => {
            //console.log("profile: ", profile, )
            //console.log("result: ", result)
            //console.log("token: ", JSON.parse(Buffer.from(result.accessToken.split('.')[1], 'base64').toString()))
            //console.log("ctx: ", ctx)

            const groups = JSON.parse(Buffer.from(result.accessToken.split('.')[1], 'base64').toString()).groups;
            console.log("groups: ", groups)

            if (!profile.email) {
              throw new Error(
                'Login failed, user profile does not contain an email',
              );
            }
            const userCategorie = groups.includes("devportal_admin") ? ["admin", "devportal_admin"] : ["user", "devportal_user"];
            // We again use the local part of the email as the user name.
            const [localPart] = profile.email.split('@');
          
            // By using `stringifyEntityRef` we ensure that the reference is formatted correctly
            const userEntityRef = stringifyEntityRef({
              kind: userCategorie[0],
              name: localPart,
              namespace: userCategorie[1],
            });
          
            return ctx.issueToken({
              claims: {
                sub: userEntityRef,
                ent: [userEntityRef],
              },
            });
          },
        }
      })

    },
  });
}
