import {
    CatalogKindExploreContent,
    ExploreLayout,
  } from '@backstage/plugin-explore';
  import React from 'react';
  import { InnerSourceExploreContent } from './InnerSourceExploreContent';
  
  export const ExplorePage = () => {
    return (
      <ExploreLayout
        title="Explore the ACME corp ecosystem"
        subtitle="Browse our ecosystem"
      >
        <ExploreLayout.Route path="domains" title="Domains">
          <CatalogKindExploreContent kind="domain" />
        </ExploreLayout.Route>
        <ExploreLayout.Route path="systems" title="Systems">
          <CatalogKindExploreContent kind="system" />
        </ExploreLayout.Route>
        <ExploreLayout.Route path="inner-source" title="InnerSource">
          <InnerSourceExploreContent />
        </ExploreLayout.Route>
      </ExploreLayout>
    );
  };
  
  export const explorePage = <ExplorePage />;