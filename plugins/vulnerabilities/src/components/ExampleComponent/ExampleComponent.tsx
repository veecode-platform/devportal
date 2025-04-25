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
import { ExampleFetchComponent } from '../ExampleFetchComponent';
import useAsync from 'react-use/lib/useAsync';
import { RepoVulnerability } from '../../utils/types';
import { SecurityInsightSummary } from '../SummaryComponent';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useConfig} from "../../hooks/useConfig";


type ReposProps = {
  owner: string;
  name: string;
};

const queryForRepo = (owner: string, name: string) => `
  query {
    repository(owner: "${owner}", name: "${name}") {
      vulnerabilityAlerts(first: 100) {
        nodes {
          securityVulnerability {
            severity
          }
        }
      }
    }
  }
`;

async function fetchVulnerabilities(
  repos: ReposProps[],
  token: string,
): Promise<RepoVulnerability[]> {
  console.log({repos, token})
  const headers = {
    // 'Content-Type': 'application/json',
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
  };

  const results: RepoVulnerability[] = [];

  for (const repo of repos) {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: queryForRepo(repo.owner, repo.name) }),
    });

    const json = await response.json();
    console.log({json})
    const alerts = json.data?.repository?.vulnerabilityAlerts?.nodes ?? [];

    const severityCount = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const alert of alerts) {
      const severity = alert.securityVulnerability?.severity?.toLowerCase();
      if (severityCount.hasOwnProperty(severity)) {
        (severityCount as any)[severity]++;
      }
    }

    results.push({
      repo: `${repo.owner}/${repo.name}`,
      total: alerts.length,
      ...severityCount,
    });
  }

  return results;
}

export const ExampleComponent = () => {
  const catalogApi = useApi(catalogApiRef);
  const { token } = useConfig()

  const fetchEntities = async (): Promise<ReposProps[]> => {
    const res = await catalogApi.getEntities({
      filter: { kind: 'Component', 'spec.type': 'service' },
    });
    return res.items.map(i => {
      const [owner, name] =
        i?.metadata?.annotations?.['github.com/project-slug'].split('/') || [];
      return { owner, name };
    });
  };

  const { value, loading, error } = useAsync(async () => {
    const r = await fetchEntities();
    console.log({r})
    if (!r.length) return [];

    return fetchVulnerabilities(r, token!);
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
              <ExampleFetchComponent value={value} loading={loading} />
            </Grid>
          </Grid>
        )}
      </Content>
    </Page>
  );
};
