/* eslint-disable no-console */
import React from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  EntityApiDefinitionCard,
  EntityHasApisCard,
} from '@veecode-platform/plugin-api-docs';
import {
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityHasSystemsCard,
  EntityLinksCard,
  EntityOrphanWarning,
  EntityProcessingErrorsPanel,
  isComponentType,
  isKind,
  hasCatalogProcessingErrors,
  isOrphan,
  EntityAboutCard,
  EntityLayout,
  EntitySwitch
} from '@veecode-platform/plugin-catalog';
import {
  isGithubActionsAvailable,
  // EntityRecentGithubActionsRunsCard,
  EntityGithubActionsContent,
} from '@veecode-platform/plugin-github-actions';
// github-workflows
import {
  GithubWorkflowsList,
  isGithubWorkflowsAvailable,
  GithubWorkflowsCard,
  isGithubAvailable
} from '@veecode-platform/backstage-plugin-github-workflows';
// gitlab-pipelines
import {
  GitlabPipelineList,
  isGitlabJobsAvailable,
  GitlabJobs
} from '@veecode-platform/backstage-plugin-gitlab-pipelines';
import {
  EntityUserProfileCard,
  EntityGroupProfileCard,
  EntityMembersListCard,
  EntityOwnershipCard,
} from '@backstage/plugin-org';
import { EntityTechdocsContent } from '@backstage/plugin-techdocs';
import { EmptyState } from '@backstage/core-components';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import {
  Entity,
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';
// argocd plugin
import {
  EntityArgoCDOverviewCard,
  isArgocdAvailable
} from '@roadiehq/backstage-plugin-argo-cd';
// github actions
import {
  EntityGithubInsightsLanguagesCard,
  EntityGithubInsightsReadmeCard,
  isGithubInsightsAvailable,
} from '@roadiehq/backstage-plugin-github-insights';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue, TextSize } from '@backstage/plugin-techdocs-module-addons-contrib';
// gitpull request
import {
  EntityGithubPullRequestsTable
} from '@roadiehq/backstage-plugin-github-pull-requests';
import { EntityVaultCard } from '@backstage/plugin-vault';
import { EntityGrafanaDashboardsCard, EntityGrafanaAlertsCard } from '@k-phoen/backstage-plugin-grafana';
import { EntityKubernetesContent } from '@backstage/plugin-kubernetes';
import { PluginItem } from './utils/types';
// gitlab
import {
  isGitlabAvailable,
  EntityGitlabLanguageCard,
  EntityGitlabPeopleCard,
  EntityGitlabMergeRequestsTable,
  EntityGitlabMergeRequestStatsCard,
  EntityGitlabReleasesCard,
} from '@immobiliarelabs/backstage-plugin-gitlab';
// roadie-lambda
import {
  EntityAWSLambdaOverviewCard,
  // isAWSLambdaAvailable
} from '@roadiehq/backstage-plugin-aws-lambda';
import { EnvironmentOverview } from '@veecode-platform/plugin-environment-explorer';
import { ClusterOverviewPage } from '@veecode-platform/backstage-plugin-cluster-explorer';
// AzureDevops
import {
  EntityAzurePipelinesContent,
  isAzurePipelinesAvailable,
} from '@backstage/plugin-azure-devops';
import { DatabaseOverview } from '@veecode-platform/plugin-database-explorer';

// Entity validate
const isAnnotationAvailable = (entity: Entity, annotation: string) =>
  !!entity?.metadata.annotations?.[annotation];

const cicdContent = (
  <EntitySwitch>
    {/* Github */}
    <EntitySwitch.Case if={(entity) => {
      if (isGithubActionsAvailable(entity) && !isAzurePipelinesAvailable(entity)) return true;
      return false
    }}>
      <EntityGithubActionsContent />
    </EntitySwitch.Case>
    {/* Gitlab */}
    ( <EntitySwitch.Case if={(entity) => {
      if (isGitlabAvailable(entity) && !isAzurePipelinesAvailable(entity)) return true;
      return false
    }}>
      <GitlabPipelineList />
    </EntitySwitch.Case>
    )
    {/* Azure */}
    <EntitySwitch.Case if={isAzurePipelinesAvailable}>
      <EntityAzurePipelinesContent defaultLimit={25} />
    </EntitySwitch.Case>

    <EntitySwitch.Case>
      <EmptyState
        title="No CI/CD available for this entity"
        missing="info"
        description="You need to add an annotation to your component if you want to enable CI/CD for it. You can read more about annotations in Backstage by clicking the button below."
        action={
          <Button
            variant="contained"
            color="primary"
            href="https://backstage.io/docs/features/software-catalog/well-known-annotations"
          >
            Read more
          </Button>
        }
      />
    </EntitySwitch.Case>
  </EntitySwitch>
);

// const cicdCard = (
//   <EntitySwitch>
//     <EntitySwitch.Case if={isGithubActionsAvailable}>
//       <Grid item lg={8} md={12} xs={12}>
//         <EntityRecentGithubActionsRunsCard limit={4} variant="gridItem" />
//       </Grid>
//     </EntitySwitch.Case>
//   </EntitySwitch>
// )

const entityWarningContent = (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={isOrphan}>
        <Grid item xs={12}>
          <EntityOrphanWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasCatalogProcessingErrors}>
        <Grid item xs={12}>
          <EntityProcessingErrorsPanel />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

  </>
);

const WorkflowsContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isGithubActionsAvailable}>
      <GithubWorkflowsList />
    </EntitySwitch.Case>

    <EntitySwitch.Case>
      <EmptyState
        title="No CI/CD available for this entity"
        missing="info"
        description="You need to add an annotation to your component if you want to enable CI/CD for it. You can read mor        about annotations in Backstage by clicking the button below."
        action={
          <Button
            variant="contained"
            color="primary"
            href="https://backstage.io/docs/features/software-catalog/well-known-annotations"
          >
            Read more
          </Button>
        }
      />
    </EntitySwitch.Case>
  </EntitySwitch>
);

/* const argoCdContent = (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={e => Boolean(isArgocdAvailable(e))}>
        <Grid item lg={12} xs={12} >
          <EntityArgoCDOverviewCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

  </>

);*/

const techdocsContent = (
  <EntityTechdocsContent>
    <TechDocsAddons>
      <TextSize />
      <ReportIssue />
    </TechDocsAddons>
  </EntityTechdocsContent>
);

const pullRequestsContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isGithubActionsAvailable}>
      <EntityGithubPullRequestsTable />
    </EntitySwitch.Case>
    <EntitySwitch.Case if={isGitlabAvailable}>
      <EntityGitlabMergeRequestsTable />
    </EntitySwitch.Case>
  </EntitySwitch>
);

const vaultContent = (
  <Grid item>
    <EntityVaultCard />
  </Grid>
);

const grafanaContent = (
  <Grid item >
    <EntityGrafanaDashboardsCard />
  </Grid>
);

const grafanaAlertsContent = (
  <Grid item  >
    <EntityGrafanaAlertsCard />
  </Grid>
)

const kubernetesContent = (
  <EntityKubernetesContent refreshIntervalMs={30000} />
)

// plugins

const plugins = [
  {
    path: "/vault",
    annotation: "vault.io/secrets-path",
    title: "Vault",
    content: vaultContent
  },
  {
    path: "/grafana",
    annotation: "grafana/dashboard-selector",
    title: "Grafana",
    content: grafanaContent
  },
  {
    path: "/grafana-alerts",
    annotation: "grafana/alert-label-selector",
    title: "Grafana Alerts",
    content: grafanaAlertsContent
  },
  /* {
    path:"/argo-cd",
    annotation: "argocd/app-name",
    title: "ArgoCD",
    content: argoCdContent
  },*/
  {
    path: "/kubernetes",
    annotation: "backstage.io/kubernetes-id",
    title: "Kubernetes",
    content: kubernetesContent
  },
  {
    path: "/docs",
    annotation: "backstage.io/techdocs-ref",
    title: "Docs",
    content: techdocsContent
  }
]


const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    {entityWarningContent}
    <Grid item lg={8} md={12} xs={12}>
      <EntityAboutCard variant="gridItem" />
    </Grid>
    <Grid item lg={4} md={12} xs={12}>
      <EntityCatalogGraphCard variant="gridItem" height={400} />
    </Grid>

    <EntitySwitch>
      <EntitySwitch.Case if={isGithubWorkflowsAvailable}>
        <Grid item lg={8} xs={12}>
          <GithubWorkflowsCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={isGitlabJobsAvailable}>
        <Grid item lg={8} xs={12}>
          <GitlabJobs />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    {/* {cicdCard} */}
    <EntitySwitch>
      <EntitySwitch.Case if={e => Boolean(isArgocdAvailable(e))}>
        <Grid item lg={6} md={12} xs={12} >
          <EntityArgoCDOverviewCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    <Grid item lg={4} md={12} xs={12}>
      <EntityLinksCard />
    </Grid>
    <EntitySwitch>
      {/* github */}
      <EntitySwitch.Case if={isGithubInsightsAvailable}>
        <Grid item lg={6} md={12} xs={12}>
          <EntityGithubInsightsReadmeCard maxHeight={350} />
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <EntityGithubInsightsLanguagesCard />
          {/* <EntityGithubInsightsReleasesCard /> */}
        </Grid>
      </EntitySwitch.Case>
      {/* gitlab */}
      <EntitySwitch.Case if={isGitlabAvailable}>
        <Grid item lg={8} md={12} xs={12}>
          <EntityGitlabMergeRequestStatsCard />
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <EntityGitlabLanguageCard />
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <EntityGitlabPeopleCard />
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <EntityGitlabReleasesCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    <EntitySwitch.Case if={(entity) => isAnnotationAvailable(entity, 'aws.com/lambda-function-name')}>
      <Grid item lg={12}>
        <EntityAWSLambdaOverviewCard />
      </Grid>
    </EntitySwitch.Case>
    <EntitySwitch.Case if={(entity) => isAnnotationAvailable(entity, 'vault.io/secrets-path')}>
      <Grid item lg={6} md={12} xs={12}>
        <EntityVaultCard />
      </Grid>
    </EntitySwitch.Case>
    <EntitySwitch.Case if={(entity) => isAnnotationAvailable(entity, 'grafana/alert-label-selector')}>
      <Grid item lg={6} md={12} xs={12}>
        <EntityGrafanaAlertsCard />
      </Grid>
    </EntitySwitch.Case>
  </Grid>
);

const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route
      if={(entity) => {
        if(isGithubAvailable(entity) && !isAzurePipelinesAvailable(entity)) return true;
        return false
        }}
      path="/workflows" title="Workflows">
      {WorkflowsContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/pull-requests" title="Pull Requests">
      {pullRequestsContent}
    </EntityLayout.Route>

    {
      plugins.map((item: PluginItem) => {
        return (
          <EntityLayout.Route
            if={(entity) => {
              const show = entity.metadata.annotations?.hasOwnProperty(item.annotation)
              if (show !== undefined) return show
              return false
            }}
            path={item.path} title={item.title} key={item.title}>
            {item.content}
          </EntityLayout.Route>
        )
      })
    }

  </EntityLayout>
);

const devopsEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route
      if={(entity) => {
        if(isGithubAvailable(entity) && !isAzurePipelinesAvailable(entity)) return true;
        return false
      }}
      path="/workflows" title="Workflows">
      {WorkflowsContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/pull-requests" title="Pull Requests">
      {pullRequestsContent}
    </EntityLayout.Route>

    {
      plugins.map((item: PluginItem) => {
        return (
          <EntityLayout.Route
            if={(entity) => {
              const show = entity.metadata.annotations?.hasOwnProperty(item.annotation)
              if (show !== undefined) return show
              return false
            }}
            path={item.path} title={item.title} key={item.title}>
            {item.content}
          </EntityLayout.Route>
        )
      })
    }

  </EntityLayout>
);

const websiteEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route
      if={(entity) => {
        if(isGithubAvailable(entity) && !isAzurePipelinesAvailable(entity)) return true;
        return false
      }}
      path="/workflows" title="Workflows">
      {WorkflowsContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/pull-requests" title="Pull Requests">
      {pullRequestsContent}
    </EntityLayout.Route>

    {
      plugins.map((item: PluginItem) => {
        return (
          <EntityLayout.Route
            if={(entity) => {
              const show = entity.metadata.annotations?.hasOwnProperty(item.annotation)
              if (show !== undefined) return show
              return false
            }}
            path={item.path} title={item.title} key={item.title} >
            {item.content}
          </EntityLayout.Route>
        )
      })
    }
  </EntityLayout>
);


const defaultEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>


    <EntityLayout.Route
      if={(entity) => {
        const show = entity.metadata.annotations?.hasOwnProperty('backstage.io/techdocs-ref')
        if (show !== undefined) return show
        return false
      }}
      path="/docs" title="Docs" >
      {techdocsContent}
    </EntityLayout.Route>

  </EntityLayout>
);

const componentPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isComponentType('service')}>
      {serviceEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isComponentType('devops')}>
      {devopsEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isComponentType('website')}>
      {websiteEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);

const apiPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Definition">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EntityApiDefinitionCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

const userPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid item xs={12} md={6}>
          <EntityUserProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityOwnershipCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

const groupPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid item xs={12} md={6}>
          <EntityGroupProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityOwnershipCard variant="gridItem" />
        </Grid>
        <Grid item xs={12}>
          <EntityMembersListCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

const systemPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item md={6}>
          <EntityHasComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasApisCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasResourcesCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/diagram" title="Diagram">
      <EntityCatalogGraphCard
        variant="gridItem"
        direction={Direction.TOP_BOTTOM}
        title="System Diagram"
        height={700}
        relations={[
          RELATION_PART_OF,
          RELATION_HAS_PART,
          RELATION_API_CONSUMED_BY,
          RELATION_API_PROVIDED_BY,
          RELATION_CONSUMES_API,
          RELATION_PROVIDES_API,
          RELATION_DEPENDENCY_OF,
          RELATION_DEPENDS_ON,
        ]}
        unidirectional={false}
      />
    </EntityLayout.Route>
  </EntityLayout>
);

const domainPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item md={6}>
          <EntityHasSystemsCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

const clusterPage = (
  <EntityLayout>

    <EntityLayout.Route 
      // if={(entity) => {
      //   const environment = entity.metadata.environment;
      //   if (typeof environment === 'object' && !Array.isArray(environment) && environment?.overview) {
      //     return true;
      //   }
      //   return false;
      // }}
      path="/" title="Overview">
      <ClusterOverviewPage />
    </EntityLayout.Route>

    <EntityLayout.Route path='/about' title='About'>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item lg={3} md={12} xs={12}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item lg={9} md={12} xs={12}>
          <EntityCatalogGraphCard
            variant="gridItem"
            direction={Direction.LEFT_RIGHT}
            title="System Diagram"
            height={300}
            relations={[
              RELATION_PART_OF,
              RELATION_HAS_PART,
              "environmentOf",
              "fromEnvironment",
              RELATION_OWNER_OF,
              RELATION_OWNED_BY,
            ]}
            relationPairs={[
              [RELATION_OWNER_OF, RELATION_OWNED_BY],
              [RELATION_CONSUMES_API, RELATION_API_CONSUMED_BY],
              [RELATION_API_PROVIDED_BY, RELATION_PROVIDES_API],
              [RELATION_HAS_PART, RELATION_PART_OF],
              ["environmentOf", "fromEnvironment"]
            ]}
            unidirectional={false}
          />
        </Grid>
        <Grid item lg={8} md={12}>
          {/* Github */}
          <EntitySwitch>
            <EntitySwitch.Case if={isGithubWorkflowsAvailable}>
              <GithubWorkflowsCard />
            </EntitySwitch.Case>
          </EntitySwitch>
          {/* Gitlab */}
          <EntitySwitch>
            <EntitySwitch.Case if={isGitlabJobsAvailable}>
              <GitlabJobs />
            </EntitySwitch.Case>
          </EntitySwitch>
          {/* Has Components */}
          <Grid item lg={12} style={{ marginTop: '1rem' }}>
            <EntityHasComponentsCard variant="gridItem" />
          </Grid>
        </Grid>

        <Grid item lg={4} md={12}>
          <EntityLinksCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route
      if={(entity) => {
        if(isGithubAvailable(entity) && !isAzurePipelinesAvailable(entity)) return true;
        return false
      }}
      path="/workflows" title="Workflows">
      {WorkflowsContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/pull-requests" title="Pull Requests">
      {pullRequestsContent}
    </EntityLayout.Route>
    <EntityLayout.Route
      if={(entity) => {
        const show = entity.metadata.annotations?.hasOwnProperty('grafana/dashboard-selector')
        return show !== undefined
      }}
      path="/grafana" title="Grafana" >
      {grafanaContent}
    </EntityLayout.Route>
    <EntityLayout.Route
      if={(entity) => {
        const show = entity.metadata.annotations?.hasOwnProperty('grafana/alert-label-selector')
        return show !== undefined
      }}
      path="/grafana-alerts" title="Grafana-alerts" >
      {grafanaAlertsContent}
    </EntityLayout.Route>
    <EntityLayout.Route
      if={(entity) => {
        const show = entity.metadata.annotations?.hasOwnProperty('backstage.io/techdocs-ref')
        if (show !== undefined) return show
        return false
      }}
      path="/docs" title="Docs" >
      {techdocsContent}
    </EntityLayout.Route>
  </EntityLayout>
);

const environmentPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={1} alignItems="stretch">
        <Grid item lg={6} md={12} xs={12}>
          <EnvironmentOverview />
        </Grid>
        <Grid item lg={6} md={12} xs={12}
        // style={{ display: 'flex', alignItems: 'stretch', flexDirection: 'column', gap: '.5rem' }}
        >
          {/* <EntityAboutCard variant='flex' /> */}
          <EntityCatalogGraphCard variant='flex' height={300} />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
)

const databasePage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={1} alignItems="stretch">
        <Grid item lg={6} md={12} xs={12}>
          <DatabaseOverview />
        </Grid>
        <Grid item lg={6} md={12} xs={12} >
          <EntityCatalogGraphCard variant='flex' height={300} />
          <Grid item style={{marginTop: '1.2rem'}}>
            <EntitySwitch>
              {/* github */}
              <EntitySwitch.Case if={isGithubInsightsAvailable}>     
                  <EntityGithubInsightsLanguagesCard />
              </EntitySwitch.Case>
              {/* gitlab */}
              <EntitySwitch.Case if={isGitlabAvailable}>
                  <EntityGitlabLanguageCard />
              </EntitySwitch.Case>
            </EntitySwitch>
          </Grid>
        </Grid>
        <Grid item lg={8} md={12} xs={12}>
          {/* Github */}
          <EntitySwitch>
            <EntitySwitch.Case if={isGithubWorkflowsAvailable}>
              <Grid item lg={12} xs={12}>
                <GithubWorkflowsCard />
              </Grid>
            </EntitySwitch.Case>
          </EntitySwitch>
          {/* Gitlab */}
          <EntitySwitch>
            <EntitySwitch.Case if={isGitlabJobsAvailable}>
              <Grid item lg={12} xs={12}>
                <GitlabJobs />
              </Grid>
            </EntitySwitch.Case>
          </EntitySwitch>
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>
    <EntityLayout.Route
      if={(entity) => {
        if(isGithubAvailable(entity) && !isAzurePipelinesAvailable(entity)) return true;
        return false
      }}
      path="/workflows" title="Workflows">
      {WorkflowsContent}
    </EntityLayout.Route>
  </EntityLayout>
)

export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case if={isKind('system')} children={systemPage} />
    <EntitySwitch.Case if={isKind('domain')} children={domainPage} />
    <EntitySwitch.Case if={isKind('cluster')} children={clusterPage} />
    <EntitySwitch.Case if={isKind('environment')} children={environmentPage} />
    <EntitySwitch.Case if={isKind('database')} children={databasePage} />
    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
