import {
    // createComponentExtension,
    createPlugin,
    // createRoutableExtension,
  } from '@backstage/core-plugin-api';
  import { createCardExtension } from '@backstage/plugin-home';
  import { rootRouteRef } from './routes';
  
  /** @public */
  export const homePlugin = createPlugin({
    id: 'home',
    routes: {
      root: rootRouteRef,
    },
  });
  

  /**
   * A component to display a list of starred entities for the user.
   *
   * @public
   */
  export const HomePageStarredEntities = homePlugin.provide(
    createCardExtension({
      name: 'HomePageStarredEntities',
      title: 'Your Starred Entities',
      components: () => import('./StarredEntities'),
    }),
  );
  


  