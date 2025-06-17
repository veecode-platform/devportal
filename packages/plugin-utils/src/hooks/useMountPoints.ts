/*
 * Portions of this file are based on code from the Red Hat Developer project:
 * https://github.com/redhat-developer/rhdh/blob/main
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

import { useContext } from 'react';

import { DynamicRootContext } from '../context';

const useMountPoints = (mountPointId: string) => {
  const context = useContext(DynamicRootContext);

  // Check if context exists (consistent with your other hook)
  if (!context) {
    throw new Error(
      'useMountPoints must be used within a DynamicPluginProvider',
    );
  }

  const { mountPoints } = context;

  // Check if mountPointId is provided
  if (!mountPointId) {
    throw new Error('mountPointId is required');
  }

  // Check if mount point exists
  if (!mountPoints || !mountPoints[mountPointId]) {
    throw new Error(`Mount point "${mountPointId}" not found!`);
  }

  return mountPoints[mountPointId];
};

export default useMountPoints;
