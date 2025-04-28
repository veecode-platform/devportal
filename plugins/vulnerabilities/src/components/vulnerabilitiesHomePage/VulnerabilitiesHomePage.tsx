import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { SecurityInsightSummary } from '../SummaryComponent';
import { useApi } from '@backstage/core-plugin-api';
import { vulnerabilitiesApiRef } from '../../api/vulnerabilitiesApi';
import { VulnerabilitiesTable } from './vulnerabilitiesTable';


export const VulnerabilitiesHomePage = () => {
  const vulnerabilitiesApi = useApi(vulnerabilitiesApiRef);

  const { value, loading, error } = useAsync(async () => {
    return await vulnerabilitiesApi.fetchVulnerabilitiesFromCatalogEntities()
  }, []);

  return (
    <Page themeId="tool">
      <Header title="Welcome to vulnerabilities!" />
      <Content>
        <ContentHeader title="Vulnerabilities">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        {error ? (
          <ResponseErrorPanel error={error} />
        ) : (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <SecurityInsightSummary value={value} loading={loading} />
            </Grid>
            <Grid item>
              <VulnerabilitiesTable value={value} loading={loading} />
            </Grid>
          </Grid>
        )}
      </Content>
    </Page>
  );
};
