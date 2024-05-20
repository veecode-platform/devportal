import React from 'react';
import { makeStyles, Theme, Grid, List, Paper } from '@material-ui/core';
import {
  catalogApiRef,
  CATALOG_FILTER_EXISTS,
} from '@backstage/plugin-catalog-react';
import { SearchType } from '@backstage/plugin-search';
import {
  DefaultResultListItem,
  SearchBar,
  SearchFilter,
  SearchPagination,
  SearchResult,
  SearchResultPager,
  useSearch,
} from '@backstage/plugin-search-react';
import {
  Content,
  Header,
  Page,
  useSidebarPinState,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';
import { ToolSearchResultListItem } from '@backstage-community/plugin-explore';
import BuildIcon from '@material-ui/icons/Build';
import { CatalogSearchResultListItem } from '@backstage/plugin-catalog';

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
              <SearchType
                values={["techdocs", "software-catalog"]}
                name="type"
                defaultValue="software-catalog"
              />
              <Paper className={classes.filters}>
                {types.includes('techdocs') && (
                  <SearchFilter.Select
                    className={classes.filter}
                    label="Entity"
                    name="name"
                    values={async () => {
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
                    values={async () => {
                      const { facets } = await catalogApi.getEntityFacets({
                        facets: ['kind'],
                        filter: {
                          'kind':
                            CATALOG_FILTER_EXISTS,
                        }
                      });
                      const kinds = facets['kind'].map(k => k.value);
                      const kindsFiltereds = kinds.filter((i:string) => {
                        if(i !== 'Group' && i !== 'Location' && i !== 'User'){
                          return i
                        }
                        else return null
                      })
                      kindsFiltereds.sort();
                      return kindsFiltereds
                    }}
                  />  

                <SearchFilter.Select
                    className={classes.filter}
                    label="Lifecycle"
                    name="lifecycle"
                    values={async () => {
                      const { facets } = await catalogApi.getEntityFacets({
                        facets: ['spec.lifecycle'],
                        filter: {
                          'spec.lifecycle':
                            CATALOG_FILTER_EXISTS,
                        }
                      });
                      const lifecycles = facets['spec.lifecycle'].map(l => l.value)
                      lifecycles.sort();
                      return lifecycles
                    }}
                  />   
              </Paper>
            </Grid>
          )}
          <Grid item xs>
            <SearchPagination />
            <SearchResult>
              {({ results }) => (
                <List>
                  {results.map(({ type, document, highlight, rank }) => {
                    switch (type) {
                      case 'software-catalog':
                        return (
                          <CatalogSearchResultListItem
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                      case 'techdocs':
                        return (
                          <TechDocsSearchResultListItem
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                      case 'tools':
                        return (
                          <ToolSearchResultListItem
                            icon={<BuildIcon />}
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                      default:
                        return (
                          <DefaultResultListItem
                            key={document.location}
                            result={document}
                            highlight={highlight}
                            rank={rank}
                          />
                        );
                    }
                  })}
                </List>
              )}
            </SearchResult>
            <SearchResultPager />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export const searchPage = <SearchPage />;