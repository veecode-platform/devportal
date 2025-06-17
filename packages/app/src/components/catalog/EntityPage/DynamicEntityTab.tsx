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

import { Entity } from '@backstage/catalog-model';
import { ApiHolder } from '@backstage/core-plugin-api';
import { EntityLayout, EntitySwitch } from '@backstage/plugin-catalog';

import Box from '@mui/material/Box';
import { DynamicRootConfig } from '@red-hat-developer-hub/plugin-utils';

import getDynamicRootConfig from '../../../utils/dynamicUI/getDynamicRootConfig';
import getMountPointData from '../../../utils/dynamicUI/getMountPointData';
import Grid from '../Grid';

export type DynamicEntityTabProps = {
  path: string;
  title: string;
  mountPoint: string;
  if?: (entity: Entity) => boolean;
  children?: React.ReactNode;
  priority?: number;
};

/**
 * Returns an configured route element suitable to use within an
 * EntityLayout component that will load content based on the dynamic
 * route and mount point configuration.  Accepts a {@link DynamicEntityTabProps}
 * Note - only call this as a function from within an EntityLayout
 * component
 * @param param0
 * @returns
 */
export const dynamicEntityTab = ({
  path,
  title,
  mountPoint,
  children,
  if: condition,
}: DynamicEntityTabProps) => (
  <EntityLayout.Route
    key={`${path}`}
    path={path}
    title={title}
    if={entity =>
      (condition
        ? errorWrappedCondition(
            `route path ${path} and title ${title}`,
            condition,
          )(entity)
        : Boolean(children)) ||
      getMountPointData<React.ComponentType>(`${mountPoint}/cards`)
        .flatMap(({ config }) => config.if)
        .some(cond =>
          errorWrappedCondition(
            `route path ${path} and title ${title}`,
            cond,
          )(entity),
        )
    }
  >
    {getMountPointData<React.ComponentType<React.PropsWithChildren>>(
      `${mountPoint}/context`,
    ).reduce(
      (acc, { Component }) => (
        <Component>{acc}</Component>
      ),
      <Grid container>
        {children}
        {getMountPointData<
          React.ComponentType<React.PropsWithChildren>,
          React.ReactNode | ((config: DynamicRootConfig) => React.ReactNode)
        >(`${mountPoint}/cards`).map(
          ({ Component, config, staticJSXContent }, index) => {
            return (
              <EntitySwitch key={`${Component.displayName}-${index}`}>
                <EntitySwitch.Case
                  if={(entity, context) =>
                    errorWrappedCondition(
                      `route path ${path}, title ${title} and mountPoint ${mountPoint}/cards`,
                      config.if,
                    )(entity, context)
                  }
                >
                  <Box sx={config.layout}>
                    <Component {...config.props}>
                      {typeof staticJSXContent === 'function'
                        ? staticJSXContent(getDynamicRootConfig())
                        : staticJSXContent}
                    </Component>
                  </Box>
                </EntitySwitch.Case>
              </EntitySwitch>
            );
          },
        )}
      </Grid>,
    )}
  </EntityLayout.Route>
);

function errorWrappedCondition(
  evaluationContext: string,
  condition: (entity: Entity, context?: { apis: ApiHolder }) => boolean,
): (entity: Entity, context?: { apis: ApiHolder }) => boolean {
  return (entity: Entity, context?: { apis: ApiHolder }) => {
    try {
      return condition(entity, context);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `Error evaluating conditional expression for ${evaluationContext}: `,
        error,
      );
    }
    return false;
  };
}
