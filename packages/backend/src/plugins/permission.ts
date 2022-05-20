import { AuthorizeResult, isResourcePermission, Permission, PolicyDecision } from "@backstage/plugin-permission-common";
import { PermissionPolicy, PolicyQuery } from "@backstage/plugin-permission-node";
import { IdentityClient,BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import { catalogConditions, createCatalogConditionalDecision } from "../utils";
import { PluginEnvironment } from "../types";
import { Router } from "express";
import {createRouter} from "@backstage/plugin-permission-backend"

class TestPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    _user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (
      // Narrow type of `request.permission` to `ResourcePermission<'catalog-entity'>
      isResourcePermission(request.permission, "catalog-entity")
    ) {
      return createCatalogConditionalDecision(
        request.permission,
        catalogConditions.isEntityOwner(
          _user?.identity.ownershipEntityRefs ?? [],
        ),
      );
    }
    return {
      result: AuthorizeResult.ALLOW,
    };
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