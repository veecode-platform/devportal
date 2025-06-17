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

import React, { ReactNode, useMemo, useState } from 'react';

import { EntityLayout } from '@backstage/plugin-catalog';

import getMountPointData from '../../../utils/dynamicUI/getMountPointData';
import { MenuIcon } from '../../Root/MenuIcon';

const makeIcon = (iconName: string) => () => <MenuIcon icon={iconName} />;

export const ContextMenuAwareEntityLayout = (props: {
  children?: ReactNode;
}) => {
  const contextMenuElements =
    getMountPointData<React.ComponentType<React.PropsWithChildren<any>>>(
      `entity.context.menu`,
    );

  const [openStates, setOpenStates] = useState(
    new Array<boolean>(contextMenuElements.length).fill(false),
  );

  const changeValueAt = (
    values: boolean[],
    index: number,
    newValue: boolean,
  ): boolean[] => values.map((v, i) => (i === index ? newValue : v));

  const extraMenuItems = useMemo(
    () =>
      contextMenuElements.map((e, index) => {
        const Icon = makeIcon(e.config.props?.icon ?? 'icon');
        return {
          title: e.config.props?.title ?? '<title>',
          Icon,
          onClick: () => {
            setOpenStates(changeValueAt(openStates, index, true));
          },
        };
      }),
    [contextMenuElements, openStates],
  );

  return (
    <>
      <EntityLayout
        UNSTABLE_extraContextMenuItems={extraMenuItems}
        UNSTABLE_contextMenuOptions={{
          disableUnregister: 'visible',
        }}
      >
        {props.children}
      </EntityLayout>
      {contextMenuElements.map(({ Component }, index) => (
        <Component
          key={`entity.context.menu-${Component.displayName}`}
          open={openStates[index]}
          onClose={() => setOpenStates(changeValueAt(openStates, index, false))}
        />
      ))}
    </>
  );
};
