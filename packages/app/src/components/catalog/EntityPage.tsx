import React from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  EntityApiDefinitionCard,
  EntityHasApisCard,
  EntityProvidingComponentsCard,
  EntityConsumingComponentsCard
} from '@backstage/plugin-api-docs';
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
} from '@backstage/plugin-catalog';
import { isGithubActionsAvailable } from '@backstage-community/plugin-github-actions';
// github-workflows
import {
  isGithubWorkflowsAvailable,
  isGithubAvailable,
  GithubWorkflowsContent
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
import { EntityVaultCard } from '@backstage-community/plugin-vault';
import { EntityGrafanaDashboardsCard, EntityGrafanaAlertsCard } from '@k-phoen/backstage-plugin-grafana';
import { EntityKubernetesContent, isKubernetesAvailable } from '@veecode-platform/plugin-kubernetes';
import { PluginItem } from './utils/types';
// gitlab
import {
  isGitlabAvailable,
  EntityGitlabLanguageCard,
  EntityGitlabMergeRequestsTable,
  EntityGitlabPeopleCard,
  EntityGitlabReadmeCard,
  EntityGitlabReleasesCard,
} from '@immobiliarelabs/backstage-plugin-gitlab';
// roadie-lambda
import {
  EntityAWSLambdaOverviewCard,
  // isAWSLambdaAvailable
} from '@roadiehq/backstage-plugin-aws-lambda';
import { EnvironmentOverview } from '@veecode-platform/plugin-environment-explorer';
import { ClusterInstructionsCard, ClusterOverviewPage } from '@veecode-platform/backstage-plugin-cluster-explorer';
// AzureDevops
import {
  EntityAzurePipelinesContent,
  isAzurePipelinesAvailable,
} from '@backstage-community/plugin-azure-devops';
import { DatabaseOverview } from '@veecode-platform/plugin-database-explorer';
import { VaultOverview } from '@veecode-platform/plugin-vault-explorer';
import { KongServiceManagerContent, isKongServiceManagerAvailable } from '@veecode-platform/plugin-kong-service-manager';
import { KubernetesGptAnalyzerPage, KubernetesGptAnalyzerCard } from '@veecode-platform/backstage-plugin-kubernetes-gpt-analyzer';
import { InfracostOverviewPage, isInfracostAvailable } from '@veecode-platform/backstage-plugin-infracost';
import { ZoraOssPage, ZoraOssProjectCard, ZoraOssProjectTable } from '@veecode-platform/backstage-plugin-zora-oss';
import {
  EntityGithubDependabotContent,
  EntitySecurityInsightsContent,
  isSecurityInsightsAvailable,
} from '@roadiehq/backstage-plugin-security-insights';
import { AssistantAIContent } from "@veecode-platform/backstage-plugin-vee"


// Entity validate
const isAnnotationAvailable = (entity: Entity, annotation: string) =>
  !!entity?.metadata.annotations?.[annotation];

const cicdContent = (
  <EntitySwitch>
    {/* Github */}
    <EntitySwitch.Case if={(entity) => {
      if (isGithubAvailable(entity) && !isAzurePipelinesAvailable(entity)) return true;
      return false
    }}>
      <GithubWorkflowsContent />
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

const linkContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={(e: Entity) => !!e.metadata.links?.length}>
      <Grid item lg={4} md={12} xs={12}>
        <EntityLinksCard />
      </Grid>
    </EntitySwitch.Case>
  </EntitySwitch>
)

const gitlabContent = (
  <>
    <Grid item lg={8} xs={12}>
      <GitlabJobs />
    </Grid>
    {linkContent}
    <Grid item lg={4} md={12} xs={12}>
      <EntityGitlabLanguageCard />
    </Grid>
    <Grid item lg={6} md={12} xs={12}>
      <EntityGitlabReadmeCard />
    </Grid>
    <Grid item lg={6} md={12} xs={12}>
      <EntityGitlabPeopleCard />
    </Grid>
    <Grid item lg={6} md={12} xs={12}>
      <EntityGitlabReleasesCard />
    </Grid>
  </>
);

const githubContent = (
  <>
    <Grid item lg={8} xs={12}>
      <GithubWorkflowsContent cards />
    </Grid>
    {linkContent}
    <Grid item lg={6} md={12} xs={12}>
      <EntityGithubInsightsReadmeCard maxHeight={350} />
    </Grid>
    <Grid item lg={6} md={12} xs={12}>
      <EntityGithubInsightsLanguagesCard />
    </Grid>
  </>
);


const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    {entityWarningContent}
    <Grid item lg={8} md={12} xs={12}>
      <EntityAboutCard variant="gridItem" />
    </Grid>
    <Grid item lg={4} md={12} xs={12}>
      <EntityCatalogGraphCard variant="gridItem" height={400} />
    </Grid>

    <Grid item lg={6}>
      <ZoraOssProjectCard />
    </Grid>

    <EntitySwitch>
      <EntitySwitch.Case if={isGithubWorkflowsAvailable}>
        {githubContent}
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={isGitlabJobsAvailable}>
        {gitlabContent}
      </EntitySwitch.Case>
    </EntitySwitch>

    {/* {ArgoCD card} */}
    <EntitySwitch>
      <EntitySwitch.Case if={e => Boolean(isArgocdAvailable(e))}>
        <Grid item lg={6} md={12} xs={12} >
          <EntityArgoCDOverviewCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={(entity) => isAnnotationAvailable(entity, 'aws.com/lambda-function-name')}>
        <Grid item lg={12}>
          <EntityAWSLambdaOverviewCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    
    <AssistantAIContent/>

    {/* <EntitySwitch>
      <EntitySwitch.Case if={(entity) => isAnnotationAvailable(entity, 'vault.io/secrets-path')}>
        <Grid item lg={6} md={12} xs={12}>
          <EntityVaultCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch> */}

    <EntitySwitch>
      <EntitySwitch.Case if={(entity) => isAnnotationAvailable(entity, 'grafana/alert-label-selector')}>
        <Grid item lg={6} md={12} xs={12}>
          <EntityGrafanaAlertsCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
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

    <EntityLayout.Route path="/pull-requests" title="Pull Requests">
      {pullRequestsContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/zora" title="Vulnerabilities">
      <ZoraOssProjectTable />
    </EntityLayout.Route>

    <EntityLayout.Route
      path="/security-insights"
      title="Security Insights"
      // Uncomment the line below if you'd like to only show the tab on entities with the correct annotations already set
       if={isSecurityInsightsAvailable}
    >
      <EntitySecurityInsightsContent />
    </EntityLayout.Route>
    <EntityLayout.Route
      path="/dependabot"
      title="Dependabot"
      // Uncomment the line below if you'd like to only show the tab on entities with the correct annotations already set
      if={isSecurityInsightsAvailable}
    >
      <EntityGithubDependabotContent />
    </EntityLayout.Route>

    <EntityLayout.Route
      if={isKongServiceManagerAvailable}
      path="/kong-service-manager" title="Kong">
      <KongServiceManagerContent />
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

const defaultEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route if={isGithubAvailable || isGitlabAvailable} path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route  if={isGithubAvailable || isGitlabAvailable} path="/pull-requests" title="Pull Requests">
      {pullRequestsContent}
    </EntityLayout.Route>

    <EntityLayout.Route
      if={isKongServiceManagerAvailable}
      path="/kong-service-manager" title="Kong">
      <KongServiceManagerContent />
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

    <EntityLayout.Route path="/pull-requests" title="Pull Requests">
      {pullRequestsContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/zora" title="Vulnerabilities">
      <ZoraOssProjectTable />
    </EntityLayout.Route>

    <EntityLayout.Route
      path="/security-insights"
      title="Security Insights"
      // Uncomment the line below if you'd like to only show the tab on entities with the correct annotations already set
       if={isSecurityInsightsAvailable}
    >
      <EntitySecurityInsightsContent />
    </EntityLayout.Route>
    <EntityLayout.Route
      path="/dependabot"
      title="Dependabot"
      // Uncomment the line below if you'd like to only show the tab on entities with the correct annotations already set
      if={isSecurityInsightsAvailable}
    >
      <EntityGithubDependabotContent />
    </EntityLayout.Route>

    <EntityLayout.Route
      if={isKongServiceManagerAvailable}
      path="/kong-service-manager" title="Kong">
      <KongServiceManagerContent />
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



const componentPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isComponentType('service')}>
      {serviceEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isComponentType('website')}>
      {websiteEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);

const apiPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid item xs={12} md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid container item md={12}>
          <EntitySwitch>
            <EntitySwitch.Case
              if={(e: Entity) =>
                e.relations!.some(rel => rel.type === 'apiProvidedBy')
              }
            >
              <Grid item xs={12} md={6}>
                <EntityProvidingComponentsCard />
              </Grid>
            </EntitySwitch.Case>
          </EntitySwitch>
          <EntitySwitch>
            <EntitySwitch.Case
              if={(e: Entity) =>
                e.relations!.some(rel => rel.type === 'apiConsumedBy')
              }
            >
              <Grid item xs={12} md={6}>
                <EntityConsumingComponentsCard />
              </Grid>
            </EntitySwitch.Case>
          </EntitySwitch>
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/definition" title="Definition">
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
    <EntityLayout.Route path="/" title="Overview">
      <ClusterOverviewPage />
    </EntityLayout.Route>

    <EntityLayout.Route path="/about" title="About">
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
              'environmentOf',
              'fromEnvironment',
              RELATION_OWNER_OF,
              RELATION_OWNED_BY,
            ]}
            relationPairs={[
              [RELATION_OWNER_OF, RELATION_OWNED_BY],
              [RELATION_CONSUMES_API, RELATION_API_CONSUMED_BY],
              [RELATION_API_PROVIDED_BY, RELATION_PROVIDES_API],
              [RELATION_HAS_PART, RELATION_PART_OF],
              ['environmentOf', 'fromEnvironment'],
            ]}
            unidirectional={false}
          />
        </Grid>

        {/* Github */}
        <EntitySwitch>
          <EntitySwitch.Case if={isGithubWorkflowsAvailable}>
            <Grid item lg={8} xs={12}>
              <GithubWorkflowsContent cards />
            </Grid>
            <Grid item lg={4} md={12} xs={12}>
              <EntityGithubInsightsLanguagesCard />
            </Grid>
            <Grid item lg={6} md={12} xs={12}>
              <EntityGithubInsightsReadmeCard maxHeight={350} />
            </Grid>

          </EntitySwitch.Case>
        </EntitySwitch>

        {/* Gitlab */}
        <EntitySwitch>
          <EntitySwitch.Case if={isGitlabJobsAvailable}>
            <Grid item lg={8} xs={12}>
              <GitlabJobs />
            </Grid>
            <Grid item lg={4} md={12} xs={12}>
              <EntityGitlabLanguageCard />
            </Grid>
            <Grid item lg={6} md={12} xs={12}>
              <EntityGitlabReadmeCard />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>

        <EntitySwitch>
          <EntitySwitch.Case if={isKubernetesAvailable}>
            <Grid item lg={6} md={12} xs={12}>
              <KubernetesGptAnalyzerCard />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>

        <Grid item lg={6} md={12} xs={12}>
          <ClusterInstructionsCard />
        </Grid>

        <EntitySwitch>
          <EntitySwitch.Case if={(e: Entity) => !!e.metadata.links?.length}>
            <Grid item lg={6} md={12} xs={12}>
              <EntityLinksCard />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>

        {/* Has Components */}
        <EntitySwitch>
          <EntitySwitch.Case
            if={(e: Entity) => e.relations!.some(rel => rel.type === 'hasPart')}
          >
            <Grid item lg={6} md={12} xs={12}>
              <EntityHasComponentsCard variant="gridItem" />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route
      if={(entity) => {
        if (
          isGithubAvailable(entity) && !isAzurePipelinesAvailable(entity) ||
          isGitlabAvailable(entity) && !isAzurePipelinesAvailable(entity)
        ) return true;
        return false
      }}
      path="/ci-cd" title="CI/CD"
    >
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route
      if={(entity) => {
        if (
          isGithubAvailable(entity) && !isAzurePipelinesAvailable(entity) ||
          isGitlabAvailable(entity) && !isAzurePipelinesAvailable(entity)
        ) return true;
        return false
      }}
      path="/pull-requests"
      title="Pull Requests"
    >
      {pullRequestsContent}
    </EntityLayout.Route>

    <EntityLayout.Route
      if={entity => isAnnotationAvailable(entity, 'grafana/dashboard-selector')}
      path="/grafana"
      title="Grafana"
    >
      {grafanaContent}
    </EntityLayout.Route>

    <EntityLayout.Route
      if={entity =>
        isAnnotationAvailable(entity, 'grafana/alert-label-selector')
      }
      path="/grafana-alerts"
      title="Grafana-alerts"
    >
      {grafanaAlertsContent}
    </EntityLayout.Route>

    <EntityLayout.Route if={isKubernetesAvailable} path="/kubernetes-gpt-analyzer" title="Kubernetes GPT">
      <KubernetesGptAnalyzerPage />
    </EntityLayout.Route>

    <EntityLayout.Route if={isInfracostAvailable} path="/infracost" title="Infracost">
      <InfracostOverviewPage />
    </EntityLayout.Route>

    <EntityLayout.Route path="/zora-oss" title="Zora OSS">
      <ZoraOssPage/>
    </EntityLayout.Route>

    <EntityLayout.Route
      if={entity => isAnnotationAvailable(entity, 'backstage.io/techdocs-ref')}
      path="/docs"
      title="Docs"
    >
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
        <Grid item lg={6} md={12} xs={12}>
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
          <Grid item style={{ marginTop: '1.2rem' }}>
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
                <GithubWorkflowsContent card />
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
    <EntityLayout.Route if={isInfracostAvailable} path="/infracost" title="Infracost">
      <InfracostOverviewPage />
    </EntityLayout.Route>

  </EntityLayout>
)

const vaultPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={1} alignItems="stretch">
        <Grid item lg={6} md={12} xs={12}>
          <VaultOverview />
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <EntityCatalogGraphCard variant='flex' height={300} />
        </Grid>
      </Grid>
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
    <EntitySwitch.Case if={isKind('vault')} children={vaultPage} />
    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
