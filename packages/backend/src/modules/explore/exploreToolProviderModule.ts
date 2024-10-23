import { createBackendModule } from '@backstage/backend-plugin-api';
import { toolProviderExtensionPoint } from '@backstage-community/plugin-explore-node';
import { ExploreTool } from '@backstage-community/plugin-explore-common';
import { StaticExploreToolProvider } from '@backstage-community/plugin-explore-backend';

const exploreTools: ExploreTool[] = [
  {
    title: 'New Relic',
    description: 'new relic plugin',
    url: '/newrelic',
    image: 'https://i.imgur.com/L37ikrX.jpg',
    tags: ['newrelic', 'proxy', 'nerdGraph'],
  },
];

export default createBackendModule({
  pluginId: 'explore',
  moduleId: 'exploreModuleToolProvider',
  register(env) {
    env.registerInit({
      deps: {
        exploreToolProvider: toolProviderExtensionPoint,
      },
      async init({ exploreToolProvider }) {
        exploreToolProvider.setToolProvider(
          StaticExploreToolProvider.fromData(exploreTools),
        );
      },
    });
  },
});