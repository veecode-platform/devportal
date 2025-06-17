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
  EntityConsumedApisCard,
  EntityProvidedApisCard,
} from '@backstage/plugin-api-docs';
import {
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasSubcomponentsCard,
  EntitySwitch,
  isKind,
} from '@backstage/plugin-catalog';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';

import Grid from '../Grid';

export const DependenciesTabContent = () => (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')}>
      <Grid
        item
        sx={{
          gridColumn: {
            lg: '1 / span 6',
            xs: '1 / -1',
          },
          gridRowEnd: 'span 6',
        }}
      >
        <EntityCatalogGraphCard
          variant="gridItem"
          direction={Direction.TOP_BOTTOM}
          height={900}
        />
      </Grid>
      <Grid
        item
        sx={{
          gridColumn: {
            lg: '7 / -1',
            xs: '1 / -1',
          },
        }}
      >
        <EntityDependsOnComponentsCard variant="gridItem" />
      </Grid>
      <Grid
        item
        sx={{
          gridColumn: {
            lg: '7 / -1',
            xs: '1 / -1',
          },
        }}
      >
        <EntityDependsOnResourcesCard variant="gridItem" />
      </Grid>
      <Grid
        item
        sx={{
          gridColumn: {
            lg: '7 / -1',
            xs: '1 / -1',
          },
        }}
      >
        <EntityHasSubcomponentsCard variant="gridItem" />
      </Grid>
      <Grid
        item
        sx={{
          gridColumn: {
            lg: '7 / -1',
            xs: '1 / -1',
          },
        }}
      >
        <EntityProvidedApisCard />
      </Grid>
      <Grid
        item
        sx={{
          gridColumn: {
            lg: '7 / -1',
            xs: '1 / -1',
          },
        }}
      >
        <EntityConsumedApisCard />
      </Grid>
    </EntitySwitch.Case>
  </EntitySwitch>
);
