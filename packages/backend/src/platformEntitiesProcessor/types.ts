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

import {
    Entity,
    entityKindSchemaValidator,
    KindValidator,
  } from '@backstage/catalog-model';
  import { JsonObject } from '@backstage/types';
  import schema from './platformEntitySchema.json';
  
  /**
   * Cluster kind Entity. 
   *
   * @public
   */
  export interface PlatformEntityV1alpha1 extends Entity {
    apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
    kind: 'Cluster';
    spec: {
      type: string;
      lifecycle: string;
      owner: string;
      subcomponentOf?: string;
      providesApis?: string[];
      consumesApis?: string[];
      dependsOn?: string[];
      system?: string;
    };
  }
  
  /**
   * Parameter that is part of a  Entity.
   *
   * @public
   */
  export interface PlatformParametersV1alpha1 extends JsonObject {
    'backstage:permissions'?: PlatformPermissionsV1alpha1;
  }
  
  /**
   *  Access control properties for parts of a component.
   *
   * @public
   */
  export interface PlatformPermissionsV1alpha1 extends JsonObject {
    tags?: string[];
  }
  
  const validator = entityKindSchemaValidator(schema);
  
  /**
   * Entity data validator for {@link PlatformEntityV1alpha1}.
   *
   * @public
   */
  export const platformEntityV1alpha1Validator: KindValidator = {
    async check(data: Entity) {
      return validator(data) === data;
    },
  };
  
  /**
   * Typeguard for filtering entities and ensuring V1alpha1 entities
   * @public
   */
  export const isClusterEntityV1alpha1 = (
    entity: Entity,
  ): entity is PlatformEntityV1alpha1 =>
    entity.apiVersion === 'backstage.io/v1alpha1' &&
    entity.kind === 'Cluster';