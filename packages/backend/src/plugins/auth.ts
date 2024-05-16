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
          resolver: async ({ result }, ctx) => {

            const allowedGroups = [env.config.getString("platform.group.admin"), env.config.getString("platform.group.user")]
            const defaultGroup = env.config.getBoolean('platform.defaultGroup.enabled');

            const userName = result.userinfo.preferred_username || result.userinfo.sub;
            const membershipGroups = result.userinfo.groups as Array<string>
            const loginAsKnownUser = allowedGroups.some(groupValue => { return membershipGroups.includes(groupValue) })

            const userEntityRef = stringifyEntityRef({
              kind: "user",
              name: userName,
            });

            if (loginAsKnownUser) {
              env.logger.warn("logging with known user")
              const mapedGroupsEntityRef = membershipGroups.map(group => `group:default/${group}`)
              mapedGroupsEntityRef.push(userEntityRef)
              return ctx.issueToken({
                claims: {
                  sub: userEntityRef, // The user's own identity
                  ent: mapedGroupsEntityRef, // A list of identities that the user claims ownership through 
                },
              });
            }

            if (defaultGroup) {
              env.logger.error('Your user belongs to a group that is not allowed in devportal');
              throw new Error('Group not authorized');
            }

            env.logger.warn('Your user belongs to a group that is not allowed in devportal, so it will assume a default role...')

            return ctx.issueToken({
              claims: {
                sub: userEntityRef, // The user's own identity
                ent: [userEntityRef, `group:default/${env.config.getString("platform.group.user")}`], // A list of identities that the user claims ownership through 
              },
            });

          },
          /*
          resolver: async ({ result }, ctx) => {

            const allowedGroups = [env.config.getString("platform.group.admin"), env.config.getString("platform.group.user")]
            const defaultGroup = env.config.getBoolean('platform.defaultGroup.enabled');

            const userName = result.userinfo.preferred_username || result.userinfo.sub;

            const { entity } = await ctx.findCatalogUser({
              entityRef: {
                name: userName
              }
            });

            const membershipGroups = entity.spec?.memberOf as Array<string>
            const loginAsKnownUser = allowedGroups.some(groupValue => { return membershipGroups.includes(groupValue) })

            if (loginAsKnownUser) {
              env.logger.warn("logging with catalog user")
              return ctx.signInWithCatalogUser({
                entityRef: {
                  name: userName
                }
              })
            }

            if (defaultGroup) {
              env.logger.error('Your user belongs to a group that is not allowed in devportal');
              throw new Error('Group not authorized');
            }

            env.logger.warn('Your user belongs to a group that is not allowed in devportal, so it will assume a default role...')
            const userEntityRef = stringifyEntityRef({
              kind: "user",
              name: userName,
            });
            return ctx.issueToken({
              claims: {
                sub: userEntityRef, // The user's own identity
                ent: [userEntityRef, `group:default/${env.config.getString("platform.group.user")}`], // A list of identities that the user claims ownership through 
              },
            });

          },*/
        },

      }),

      okta: providers.okta.create({
        signIn: {
          resolver: async ({ profile, result }, ctx) => {
            try {
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
            catch (e) {
              throw new Error("Login failed")
            }
          },
        }
      }),
      github: providers.github.create({
        signIn: {
          async resolver({ result: { fullProfile } }, ctx) {
            const userId = fullProfile.username;
            if (!userId) {
              throw new Error(
                `GitHub user profile does not contain a username`,
              );
            }

            const userEntityRef = stringifyEntityRef({
              kind: 'User',
              name: userId,
              namespace: 'DEFAULT_NAMESPACE',
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
      gitlab: providers.gitlab.create({
        signIn: {
          async resolver({ result: { fullProfile } }, ctx) {
            const userId = fullProfile.id;
            const userName = fullProfile.displayName
            if (!userId) {
              throw new Error(
                `Gitlab user profile does not contain a userId`,
              );
            }

            const userEntityRef = stringifyEntityRef({
              kind: 'User',
              name: userName,
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
    },
  });
}
