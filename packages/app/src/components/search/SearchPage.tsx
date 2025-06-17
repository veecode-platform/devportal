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

import { CatalogIcon, Content, Header, Page } from '@backstage/core-components';
import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';
import { SearchType } from '@backstage/plugin-search';
import {
  SearchBar,
  SearchFilter,
  SearchPagination,
  SearchResult,
} from '@backstage/plugin-search-react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from 'tss-react/mui';

import getMountPointData from '../../utils/dynamicUI/getMountPointData';
import { MenuIcon } from '../Root/MenuIcon';

const useStyles = makeStyles()(theme => ({
  searchBar: {
    borderRadius: '50px',
    margin: 'auto',
    boxShadow: theme.shadows.at(1),
  },
  filters: {
    padding: theme.spacing(2),
    gap: theme.spacing(2.5),
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  notchedOutline: {
    borderStyle: 'none!important',
  },
}));

export const SearchPage = () => {
  const { classes } = useStyles();

  return (
    <Page themeId="home">
      <Header title="Search" />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            {/* useStyles has a lower precedence over mui styles hence why we need use use css */}
            <SearchBar
              InputProps={{
                classes: {
                  notchedOutline: classes.notchedOutline,
                },
              }}
              className={classes.searchBar}
            />
          </Grid>
          <Grid item xs={3}>
            <SearchType.Accordion
              name="Result Type"
              defaultValue="software-catalog"
              types={[
                {
                  value: 'software-catalog',
                  name: 'Software Catalog',
                  icon: <CatalogIcon />,
                },
                ...getMountPointData<
                  (
                    name: string,
                    icon: React.ReactElement,
                  ) => {
                    name: string;
                    icon: React.ReactElement;
                    value: string;
                  }
                >('search.page.types').map(
                  ({ Component: getSearchType, config: { props } }) =>
                    getSearchType(
                      props?.name || '',
                      <MenuIcon icon={props?.icon || ''} />,
                    ),
                ),
              ]}
            />
            <Paper className={classes.filters}>
              <SearchFilter.Select
                label="Kind"
                name="kind"
                values={['Component', 'Template']}
              />
              <SearchFilter.Checkbox
                label="Lifecycle"
                name="lifecycle"
                values={['experimental', 'production']}
              />
              {...getMountPointData<React.ComponentType>(
                'search.page.filters',
              ).map(({ Component, config }, idx) => {
                return (
                  <Component key={`search_filter_${idx}`} {...config.props} />
                );
              })}
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <SearchPagination />
            <SearchResult>
              <CatalogSearchResultListItem icon={<CatalogIcon />} />
              {getMountPointData<React.ComponentType>(
                'search.page.results',
              ).map(({ Component, config }, idx) => {
                const ComponentWithIcon = Component as React.FunctionComponent<{
                  icon: React.ReactElement;
                }>;
                return (
                  <ComponentWithIcon
                    {...config.props}
                    key={`search_results_${idx}`}
                    icon={<MenuIcon icon={config.props?.icon || ''} />}
                  />
                );
              })}
            </SearchResult>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
