/* eslint-disable no-console */
import React from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  EntityApiDefinitionCard,
  EntityHasApisCard,
} from '@backstage/plugin-api-docs';
import {
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityHasSystemsCard,
  EntityLinksCard,
  EntitySwitch,
  EntityOrphanWarning,
  EntityProcessingErrorsPanel,
  isComponentType,
  isKind,
  hasCatalogProcessingErrors,
  isOrphan,
} from '@backstage/plugin-catalog';
// custom
import { AboutCard as EntityAboutCard } from "../catalog/AboutCard";
import {EntityContextProvider} from "../../context/EntityContext"
import {
  isGithubActionsAvailable,
  EntityRecentGithubActionsRunsCard,
  EntityGithubActionsContent,
} from '@backstage/plugin-github-actions';
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
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
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
import VaultEntity from './Vault/VaultEntity';
import GrafanaEntity from './Grafana/GrafanaEntity';
import { EntityLayout } from './entityLayout';
import { validateAnnotation } from './utils/validateAnnotation';
import { PluginItem } from './utils/types';

const cicdContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isGithubActionsAvailable}>
      <EntityGithubActionsContent />
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

const cicdCard = (
  <EntitySwitch>
    <EntitySwitch.Case if={isGithubActionsAvailable}>
      <Grid item lg={8} md={12} xs={12}>
        <EntityRecentGithubActionsRunsCard limit={4} variant="gridItem" />
      </Grid>
    </EntitySwitch.Case>
  </EntitySwitch>
)

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

const argoCdContent = (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={e => Boolean(isArgocdAvailable(e))}>
        <Grid item lg={12} xs={12} >
          <EntityArgoCDOverviewCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

  </>

);

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
    <EntitySwitch.Case>
      <EntityGithubPullRequestsTable/>
      {/* <HomePageYourOpenPullRequestsCard/> */}
      {/* <HomePageRequestedReviewsCard/> */}
      {/* <EntityGithubPullRequestsOverviewCard/> */}
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
    path:"/vault",
    annotation: "vault.io/secrets-path",
    title: "Vault",
    content: vaultContent
  },
  {
    path:"/grafana",
    annotation: "grafana/alert-label-selector",
    title: "Grafana",
    content: grafanaContent
  },
  {
    path:"/grafana-alerts",
    annotation: "grafana/alert-label-selector",
    title: "Grafana Alerts",
    content: grafanaAlertsContent
  },
  {
    path:"/argo-cd",
    annotation: "argocd/app-name",
    title: "ArgoCD",
    content: argoCdContent
  },
  {
    path:"/kubernetes",
    annotation: "backstage.io/kubernetes-id",
    title: "Kubernetes",
    content: kubernetesContent
  },
  {
    path:"/docs",
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
    {cicdCard}
    <Grid item lg={4} md={12} xs={12}>
      <EntityLinksCard />
    </Grid>
    <EntitySwitch>
      <EntitySwitch.Case if={isGithubInsightsAvailable}>
        <Grid item lg={6} md={12} xs={12}>
          <EntityGithubInsightsReadmeCard maxHeight={350}/>
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
          <EntityGithubInsightsLanguagesCard/>
          {/* <EntityGithubInsightsReleasesCard /> */}
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    {validateAnnotation('vault.io/secrets-path') && (
      <Grid item lg={6} md={12} xs={12} >
        <VaultEntity />
      </Grid>
        )}
    {validateAnnotation('grafana/alert-label-selector') && (
      <Grid item lg={6} md={12} xs={12}>
        <GrafanaEntity />
      </Grid>
    )}
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

    {plugins.map((item : PluginItem) : any => {
      if(!!validateAnnotation(item.annotation)) 
      return (
      <EntityLayout.Route path={item.path} title={item.title} key={item.title}>
        {item.content}
      </EntityLayout.Route>
      )
    })}

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

    {plugins.map((item: PluginItem) : any => {
      if(!!validateAnnotation(item.annotation)) 
      return (
      <EntityLayout.Route path={item.path} title={item.title} key={item.title}>
        {item.content}
      </EntityLayout.Route>)
    })}

  </EntityLayout>
);


const defaultEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>
    
    {validateAnnotation('backstage.io/techdocs-ref') &&
      <EntityLayout.Route path="/docs" title="Docs">
        {techdocsContent}
      </EntityLayout.Route>
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

export const entityPage = (
<EntityContextProvider>
<EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case if={isKind('system')} children={systemPage} />
    <EntitySwitch.Case if={isKind('domain')} children={domainPage} />

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
</EntityContextProvider>
);
