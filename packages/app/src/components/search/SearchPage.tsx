import React from 'react';
import { makeStyles, Theme, Grid, /* List,*/ Paper } from '@material-ui/core';
import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
} from '@backstage/plugin-catalog-react';
import { SearchType } from '@backstage/plugin-search';
import {
  SearchBar,
  SearchFilter,
  SearchPagination,
  SearchResult,
  SearchResultPager,
  useSearch,
} from '@backstage/plugin-search-react';
import {
  CatalogIcon,
  Content,
  DocsIcon,
  Header,
  Page,
  useSidebarPinState,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api'; 
import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';
import { ToolSearchResultListItem } from '@backstage/plugin-explore';
import BuildIcon from '@material-ui/icons/Build';
import { CatalogSearchResultListItem } from '@veecode-platform/plugin-catalog';

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    padding: theme.spacing(1, 0),
  },
  filters: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  filter: {
    '& + &': {
      marginTop: theme.spacing(2.5),
    },
  },
}));

const SearchPage = () => {
  const classes = useStyles();
  const { isMobile } = useSidebarPinState();
  const { types } = useSearch();
  const catalogApi = useApi(catalogApiRef);

  return (
    <Page themeId="home">
      {!isMobile && <Header title="Search" />}
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchBar debounceTime={100} />
          </Grid>
          {!isMobile && (
            <Grid item xs={3}>
              <SearchType.Accordion
                name="Result Type"
                defaultValue="software-catalog"
                showCounts
                types={[
                  {
                    value: 'software-catalog',
                    name: 'Software Catalog',
                    icon: <CatalogIcon />,
                  },
                  {
                    value: 'techdocs',
                    name: 'Documentation',
                    icon: <DocsIcon />,
                  },
                ]}
              />
              <Paper className={classes.filters}>
                {types.includes('techdocs') && (
                  <SearchFilter.Select
                    className={classes.filter}
                    label="Entity"
                    name="name"
                    values={async () => {
                      // Return a list of entities which are documented.
                      const { items } = await catalogApi.getEntities({
                        fields: ['metadata.name'],
                        filter: {
                          'metadata.annotations.backstage.io/techdocs-ref':
                            CATALOG_FILTER_EXISTS,
                        },
                      });

                      const names = items.map(entity => entity.metadata.name);
                      names.sort();
                      return names;
                    }}
                  />
                )}
                <SearchFilter.Select
                  className={classes.filter}
                  label="Kind"
                  name="kind"
                  values={['Component', 'Template']}
                />
                <SearchFilter.Checkbox
                  className={classes.filter}
                  label="Lifecycle"
                  name="lifecycle"
                  values={['experimental', 'production']}
                />
              </Paper>
            </Grid>
          )}
          <Grid item xs>
            <SearchPagination />
            <SearchResult>
              <CatalogSearchResultListItem icon={<CatalogIcon />} />
              <TechDocsSearchResultListItem icon={<DocsIcon />} />
              <ToolSearchResultListItem icon={<BuildIcon />} />
            </SearchResult>
            <SearchResultPager />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export const searchPage = <SearchPage />;
