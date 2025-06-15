import React from 'react';
import { ExploreLayout , GroupsExplorerContent } from '@backstage-community/plugin-explore';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export const ExplorePage = () => {
  const configApi = useApi(configApiRef);
  const organizationName =
    configApi.getOptionalString('organization.name') ?? 'Backstage';

  return (
    <ExploreLayout
      title={`Explore the ${organizationName} ecosystem`}
      subtitle="Discover solutions available in your ecosystem"
    >
      {/* <ExploreLayout.Route path="domains" title="Domains">
        <CatalogKindExploreContent kind="domain" />
      </ExploreLayout.Route> */}
      <ExploreLayout.Route path="groups" title="Groups">
        <GroupsExplorerContent />
      </ExploreLayout.Route>
      {/* <ExploreLayout.Route path="tools" title="Tools">
        <ToolExplorerContent />
      </ExploreLayout.Route> */}
    </ExploreLayout>
  );
};