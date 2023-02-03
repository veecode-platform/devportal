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

      "keycloak": providers.oidc.create({
        signIn: {
          resolver({result}, ctx) {

              if(!result.userinfo.email_verified){
                throw new Error('Email not verified');
              }
              
              const groups = result.userinfo.groups as Array<string>;
              const admin = groups.includes("admin");
              const user = groups.includes("user");

              if(!admin && !user){
                throw new Error('Group not authorized');
              }

              const userName = result.userinfo.preferred_username;
              
              const userEntityRef = stringifyEntityRef({
                kind: admin ? "Admin" : "User",
                name: userName || result.userinfo.sub,
                namespace: "user"
              });
              return ctx.issueToken({
                claims: {
                  sub: userEntityRef, // The user's own identity
                  ent: [userEntityRef], // A list of identities that the user claims ownership through
                },
              });           
          },
        },

      }),

      okta: providers.okta.create({
        signIn:{
          resolver: async ({profile, result}, ctx) => {
            try{
              const groups = JSON.parse(Buffer.from(result.accessToken.split('.')[1], 'base64').toString()).groups;

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
            }
            catch(e){
              throw new Error("Login failed")
            }
          },
        }
      })

    },
  });
}
