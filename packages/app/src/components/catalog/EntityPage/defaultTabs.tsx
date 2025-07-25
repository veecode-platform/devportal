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
import { isKind } from '@backstage/plugin-catalog';

import { isType } from '../utils';
import { ApiTabContent } from './ApiTabContent';
import { DefinitionTabContent } from './DefinitionTabContent';
import { DependenciesTabContent } from './DependenciesTabContent';
import { DiagramTabContent } from './DiagramTabContent';
import { DynamicEntityTabProps } from './DynamicEntityTab';
import { OverviewTabContent } from './OverviewTabContent';
import { EntityKubernetesContent } from '@backstage/plugin-kubernetes';
import Grid from '../Grid';

/**
 * The default set of entity tabs in the default order
 */
export const defaultTabs: Record<
  string,
  Omit<DynamicEntityTabProps, 'if' | 'children' | 'path'>
> = {
  '/': {
    title: 'Overview',
    mountPoint: 'entity.page.overview',
  },
  '/topology': {
    title: 'Topology',
    mountPoint: 'entity.page.topology',
  },
  '/issues': {
    title: 'Issues',
    mountPoint: 'entity.page.issues',
  },
  '/pr': {
    title: 'Pull/Merge Requests',
    mountPoint: 'entity.page.pull-requests',
  },
  '/ci': {
    title: 'CI',
    mountPoint: 'entity.page.ci',
  },
  '/cd': {
    title: 'CD',
    mountPoint: 'entity.page.cd',
  },
  '/kubernetes': {
    title: 'Kubernetes',
    mountPoint: 'entity.page.kubernetes',
  },
  '/image-registry': {
    title: 'Image Registry',
    mountPoint: 'entity.page.image-registry',
  },
  '/monitoring': {
    title: 'Monitoring',
    mountPoint: 'entity.page.monitoring',
  },
  '/lighthouse': {
    title: 'Lighthouse',
    mountPoint: 'entity.page.lighthouse',
  },
  '/api': {
    title: 'Api',
    mountPoint: 'entity.page.api',
  },
  '/dependencies': {
    title: 'Dependencies',
    mountPoint: 'entity.page.dependencies',
  },
  '/docs': {
    title: 'Docs',
    mountPoint: 'entity.page.docs',
  },
  '/definition': {
    title: 'Definition',
    mountPoint: 'entity.page.definition',
  },
  '/system': {
    title: 'Diagram',
    mountPoint: 'entity.page.diagram',
  },
};

/**
 * Additional tab visibility rules for specific entity routes
 */
export const tabRules: Record<
  string,
  Omit<DynamicEntityTabProps, 'path' | 'title' | 'mountPoint' | 'children'>
> = {
  '/api': {
    if: (entity: Entity) =>
      isType('service')(entity) && isKind('component')(entity),
  },
  '/dependencies': {
    if: isKind('component'),
  },
  '/definition': {
    if: isKind('api'),
  },
  '/system': {
    if: isKind('system'),
  },
  '/kubernetes': {
    if: isKind('cluster')
  }
};

/**
 * Additional child elements to be rendered at specific entity routes
 */
export const tabChildren: Record<
  string,
  Omit<DynamicEntityTabProps, 'path' | 'title' | 'mountPoint' | 'if'>
> = {
  '/': {
    children: <OverviewTabContent />,
  },
  '/api': {
    children: <ApiTabContent />,
  },
  '/dependencies': {
    children: <DependenciesTabContent />,
  },
  '/definition': {
    children: <DefinitionTabContent />,
  },
  '/system': {
    children: <DiagramTabContent />,
  },
  '/kubernetes': {
    children: <Grid item sx={{ gridColumn: '1 / -1' }}>
      <EntityKubernetesContent refreshIntervalMs={30000} />
    </Grid>
  }
};
