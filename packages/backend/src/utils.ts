import { Entity } from "@backstage/catalog-model";
import { EntitiesSearchFilter } from "@backstage/plugin-catalog-backend";
import { AuthorizeResult, PermissionCondition, PermissionCriteria, ResourcePermission } from "@backstage/plugin-permission-common";
import { Conditions, PermissionRule } from "@backstage/plugin-permission-node";

declare type ConditionalPolicyDecision = {
  result: AuthorizeResult.CONDITIONAL;
  pluginId: string;
  resourceType: string;
  conditions: PermissionCriteria<PermissionCondition>;
};
export declare const catalogConditions: Conditions<    {
  hasAnnotation: PermissionRule<Entity, EntitiesSearchFilter, "catalog-entity", [annotation: string]>;
  hasLabel: PermissionRule<Entity, EntitiesSearchFilter, "catalog-entity", [label: string]>;
  hasMetadata: PermissionRule<Entity, EntitiesSearchFilter, "catalog-entity", [key: string, value?: string | undefined]>;
  hasSpec: PermissionRule<Entity, EntitiesSearchFilter, "catalog-entity", [key: string, value?: string | undefined]>;
  isEntityKind: PermissionRule<Entity, EntitiesSearchFilter, "catalog-entity", [kinds: string[]]>;
  isEntityOwner: PermissionRule<Entity, EntitiesSearchFilter, "catalog-entity", [claims: string[]]>;
  }>;
  
export declare const createCatalogConditionalDecision: (permission: ResourcePermission<"catalog-entity">, conditions: PermissionCriteria<PermissionCondition<"catalog-entity", unknown[]>>) => ConditionalPolicyDecision;