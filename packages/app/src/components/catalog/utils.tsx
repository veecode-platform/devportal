/*
 * Portions of this file are based on code from the Red Hat Developer project:
 * https://github.com/redhat-developer/rhdh/blob/main/packages/app
 *
 * Original Copyright (c) 2022 Red Hat Developer (or the exact copyright holder from the original source, please verify in their repository)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { type Entity } from '@backstage/catalog-model';

export const isType = (types: string | string[]) => (entity: Entity) => {
  if (!entity?.spec?.type) {
    return false;
  }
  return typeof types === 'string'
    ? entity?.spec?.type === types
    : types.includes(entity.spec.type as string);
};
export const hasAnnotation = (keys: string) => (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[keys]);

export const hasLinks = (entity: Entity) =>
  Boolean(entity.metadata.links?.length);
