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

import { ContextMenuAwareEntityLayout } from './ContextMenuAwareEntityLayout';
import { tabChildren, tabRules } from './defaultTabs';
import { dynamicEntityTab, DynamicEntityTabProps } from './DynamicEntityTab';
import { mergeTabs } from './utils';

/**
 * Displays the tabs and content for a catalog entity
 * *Note:* do not convert convert this to a component or wrap the return value
 * @param entityTabOverrides
 * @returns
 */
export const entityPage = (
  entityTabOverrides: Record<
    string,
    Omit<DynamicEntityTabProps, 'path' | 'if' | 'children'>
  > = {},
) => {
  return (
    <ContextMenuAwareEntityLayout>
      {mergeTabs(entityTabOverrides).map(([path, config]) => {
        return dynamicEntityTab({
          ...config,
          path,
          ...(tabRules[path] ? tabRules[path] : {}),
          ...(tabChildren[path] ? tabChildren[path] : {}),
        } as DynamicEntityTabProps);
      })}
    </ContextMenuAwareEntityLayout>
  );
};
