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

import React, { useContext, useMemo } from 'react';

import { ErrorBoundary } from '@backstage/core-components';

import DynamicRootContext, {
  MountPoint,
  MountPointConfigBase,
} from '@red-hat-developer-hub/plugin-utils';

type Position = 'above-main-content' | 'above-sidebar';

type ApplicationHeaderMountPointConfig = MountPointConfigBase & {
  position: Position;
  layout?: React.CSSProperties;
};

type ApplicationHeaderMountPoint = MountPoint & {
  Component: React.ComponentType<
    React.PropsWithChildren<{
      position: Position;
      layout?: React.CSSProperties;
    }>
  >;
  config?: ApplicationHeaderMountPointConfig;
};

export const ApplicationHeaders = ({ position }: { position: Position }) => {
  const { mountPoints } = useContext(DynamicRootContext);

  const appHeaderMountPoints = useMemo(() => {
    const appHeaderMP = (mountPoints['application/header'] ??
      []) as ApplicationHeaderMountPoint[];

    return appHeaderMP.filter(({ config }) => config?.position === position);
  }, [mountPoints, position]);

  return appHeaderMountPoints.map(({ Component, config }, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <ErrorBoundary key={index}>
      <Component
        position={position}
        {...config?.props}
        layout={config?.layout}
      />
    </ErrorBoundary>
  ));
};
