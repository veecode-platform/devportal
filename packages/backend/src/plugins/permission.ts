// basic policy

import { IdentityClient } from '@backstage/plugin-auth-node';
import { createRouter } from '@backstage/plugin-permission-backend';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import { PermissionPolicy, PolicyQuery } from '@backstage/plugin-permission-node';
import { Router } from 'express';
import { PluginEnvironment } from '../types';


class TestPermissionPolicy implements PermissionPolicy {
  async handle(request: PolicyQuery): Promise<PolicyDecision> {
    if (request.permission.name === 'catalog.entity.delete') {
    return { 
              result: AuthorizeResult.DENY 
            };
  }
  return { result: AuthorizeResult.ALLOW };
 }
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: new TestPermissionPolicy(),
    identity: IdentityClient.create({
      discovery: env.discovery,
      issuer: await env.discovery.getExternalBaseUrl('auth'),
    }),
  });
}




// //   // policy Button Delete all groups---------------------------------------------------

// import { IdentityClient } from '@backstage/plugin-auth-node';
// import { createRouter } from '@backstage/plugin-permission-backend';
// import {
//   AuthorizeResult,
//   isPermission,
//   PolicyDecision,
// } from '@backstage/plugin-permission-common';
// import { PermissionPolicy,  PolicyQuery } from '@backstage/plugin-permission-node';
// import { Router } from 'express';
// import { PluginEnvironment } from '../types';

// //teste
//    import {
//      catalogEntityDeletePermission, // for delete
//      catalogEntityCreatePermission, // for create 
//      catalogEntityReadPermission, // for read (visible or not)
//      catalogEntityRefreshPermission, // for not refresh component
//      catalogLocationCreatePermission, // for not possible add url in "Register an existing component"
//    } from '@backstage/plugin-catalog-common/alpha';

// //Desabilitar uma permição de excluir a entidade do catálogo ou criar
// class TestPermissionPolicy implements PermissionPolicy {
//     async handle(request: PolicyQuery): Promise<PolicyDecision> {
//       // if (request.permission.name === 'catalog.entity.delete'
//           // || request.permission.name === 'catalog.entity.create'
//         if (isPermission(request.permission, catalogEntityDeletePermission)) {
//         return {
//           result: AuthorizeResult.DENY,
//       };
//     }
//     return { result: AuthorizeResult.ALLOW };
//   }
// }

// export default async function createPlugin(
//   env: PluginEnvironment,
// ): Promise<Router> {
//   return await createRouter({
//     config: env.config,
//     logger: env.logger,
//     discovery: env.discovery,
//     policy: new TestPermissionPolicy(),
//     identity: IdentityClient.create({
//       discovery: env.discovery,
//       issuer: await env.discovery.getExternalBaseUrl('auth'),
//     }),
//   });
// }




// // // Custom Policy -------------------------------------------------


// import { IdentityClient,BackstageIdentityResponse } from '@backstage/plugin-auth-node';
// import {
//   AuthorizeResult,
//   isResourcePermission,
//   PolicyDecision
// } from '@backstage/plugin-permission-common';
// import {
//     catalogConditions,
//     createCatalogConditionalDecision
// }from '@backstage/plugin-catalog-backend/alpha';
// import { PermissionPolicy,  PolicyQuery } from '@backstage/plugin-permission-node';
// import { createRouter } from '@backstage/plugin-permission-backend';
// import { Router } from 'express';
// import { PluginEnvironment } from '../types';

// custom
// import { isInSystem } from './catalog';

// class TestPermissionPolicy implements PermissionPolicy {
//   async handle(
//     request: PolicyQuery,
//     user?: BackstageIdentityResponse,
//   ): Promise<PolicyDecision> {
//     if (
//       Narrow type of `request.permission` to `ResourcePermission<'catalog-entity'>`
//       isResourcePermission(request.permission, 'catalog-entity')
//     ) {
//       return createCatalogConditionalDecision(
//         request.permission,
//         catalogConditions.isEntityOwner(
//           _user?.identity.ownershipEntityRefs ?? [],
//         ),
//          {
//              anyOf: [
//                catalogConditions.isEntityOwner(
//                  user?.identity.ownershipEntityRefs ?? []
//                ),
//                isInSystem('interviewing')
//              ]
//            }
//       );
//     }
//     return {
//       result: AuthorizeResult.ALLOW,
//     };
//   }
// }

// export default async function createPlugin(
//   env: PluginEnvironment,
// ): Promise<Router> {
//   return await createRouter({
//     config: env.config,
//     logger: env.logger,
//     discovery: env.discovery,
//     policy: new TestPermissionPolicy(),
//     identity: IdentityClient.create({
//       discovery: env.discovery,
//       issuer: await env.discovery.getExternalBaseUrl('auth'),
//     }),
//   });
// }




// // View only your catalog when the group owner is your-------------------------------------------------

// import {
//   BackstageIdentityResponse,
//   IdentityClient
// } from '@backstage/plugin-auth-node';
//  import {
//  AuthorizeResult,
//  PolicyDecision,
// isResourcePermission,
// } from '@backstage/plugin-permission-common';
// import {
//   catalogConditions,
//   createCatalogConditionalDecision,
// } from '@backstage/plugin-catalog-backend/alpha';
// import { PermissionPolicy,  PolicyQuery } from '@backstage/plugin-permission-node';
// import { createRouter } from '@backstage/plugin-permission-backend';
//  import { Router } from 'express';
//  import { PluginEnvironment } from '../types';


//  class TestPermissionPolicy implements PermissionPolicy {
//   async handle(
//     request: PolicyQuery,
//     user?: BackstageIdentityResponse,
//    ): Promise<PolicyDecision> {
//     if (isResourcePermission(request.permission, 'catalog-entity') ) {
//       return createCatalogConditionalDecision(
//         request.permission,
//         catalogConditions.isEntityOwner(
//           user?.identity.ownershipEntityRefs ?? [],
//         ),
//       );
//      }

//      return { result: AuthorizeResult.ALLOW };
//    }
//  }

// export default async function createPlugin(
// env: PluginEnvironment,
// ): Promise<Router> {
// return await createRouter({
//   config: env.config,
//   logger: env.logger,
//   discovery: env.discovery,
//   policy: new TestPermissionPolicy(),
//   identity: IdentityClient.create({
//     discovery: env.discovery,
//     issuer: await env.discovery.getExternalBaseUrl('auth'),
//   }),
// });
// }