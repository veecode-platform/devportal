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

export const DefaultMainMenuItems = {
  menuItems: {
    'default.catalog': {
      title: 'Catalog',
      icon: 'category',
      to: 'catalog',
      priority: 80,
    },
    'default.apis': {
      title: 'APIs',
      icon: 'extension',
      to: 'api-docs',
      priority: 70,
    },
    'default.create': {
      title: 'Create',
      icon: 'add',
      to: 'create',
      priority: 50,
    },
    'default.docs': {
      title: 'Docs',
      icon: 'library',
      to: 'docs',
      priority: 60,
    },
    'default.groups': {
      title: 'Groups',
      icon: 'groups',
      to: 'explore/groups',
      priority: 60,
    },/*
    'default.vulnerabilities': {
      title: 'Vulnerabilities',
      icon: 'vulnerabilities',
      to: 'vulnerabilities',
      priority: 60,
    },*/
  },
};
