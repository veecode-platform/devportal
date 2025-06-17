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

import {
  FrontendConfig,
  MenuItem,
  MenuItemConfig,
} from './extractDynamicConfig';

export function getNameFromPath(path: string): string {
  const trimmedPath = path.trim();
  const noLeadingTrailingSlashes = trimmedPath.startsWith('/')
    ? trimmedPath.slice(1)
    : trimmedPath;

  const cleanedPath = noLeadingTrailingSlashes.endsWith('/')
    ? noLeadingTrailingSlashes.slice(0, -1)
    : noLeadingTrailingSlashes;

  return cleanedPath.split('/').join('.');
}

function isStaticPath(path: string): boolean {
  return !path.includes(':') && !path.includes('*');
}

export function compareMenuItems(a: MenuItem, b: MenuItem) {
  return (b.priority ?? 0) - (a.priority ?? 0);
}

function convertMenuItemsRecordToArray(
  menuItemsRecord: Record<string, MenuItemConfig>,
): MenuItem[] {
  return Object.keys(menuItemsRecord).map(
    key =>
      ({
        ...menuItemsRecord[key],
        children: [],
        name: key,
      }) as MenuItem,
  );
}

export function buildTree(menuItemsArray: MenuItem[]): MenuItem[] {
  const itemMap: Record<string, MenuItem> = {};

  menuItemsArray.forEach(item => {
    if (!itemMap[item.name]) {
      itemMap[item.name] = { ...item, children: [] };
    } else {
      itemMap[item.name] = {
        ...itemMap[item.name],
        ...item,
        children: itemMap[item.name].children,
      };
    }
  });

  const filteredItemMap = Object.fromEntries(
    Object.entries(itemMap).filter(
      ([_, item]) => item.enabled !== false && item.title,
    ),
  );

  const tree: MenuItem[] = [];
  Object.values(filteredItemMap).forEach(item => {
    if (item.parent) {
      const parentItem = itemMap[item.parent];
      if (parentItem) {
        parentItem.children.push(item);
        parentItem.children.sort(compareMenuItems);
      }
    } else {
      tree.push(item);
    }
  });

  return tree.sort(compareMenuItems);
}

export function extractMenuItems(frontend: FrontendConfig): MenuItem[] {
  const items: MenuItem[] = [];

  Object.entries(frontend).forEach(([_, customProperties]) => {
    // Process dynamicRoutes
    if (customProperties.dynamicRoutes) {
      customProperties.dynamicRoutes.forEach(dr => {
        const itemName = getNameFromPath(dr.path);
        const mi = dr.menuItem;
        if (mi && isStaticPath(dr.path)) {
          items.push({
            name: itemName,
            icon: 'icon' in mi && mi.icon ? mi.icon : '',
            title: 'text' in mi && mi.text ? mi.text : '',
            to: dr.path ?? '',
            children: [],
            enabled: 'enabled' in mi ? mi.enabled : true,
          });
        }
      });
    }

    // Process menuItems
    if (customProperties.menuItems) {
      const menuItemsArray = convertMenuItemsRecordToArray(
        customProperties.menuItems,
      );
      items.push(...menuItemsArray);
    }
  });

  return buildTree(items);
}
