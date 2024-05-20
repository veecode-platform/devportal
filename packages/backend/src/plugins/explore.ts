import {
    createRouter,
    StaticExploreToolProvider,
  } from '@backstage-community/plugin-explore-backend';
  import { ExploreTool } from '@backstage-community/plugin-explore-common';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';
  
  // List of tools you want to surface in the Explore plugin "Tools" page.
  const exploreTools: ExploreTool[] = [
    {
      title: 'Api Catalog',
      description: 'Your main specs in one place.',
      url: '/api-docs',
      image: 'https://platform.vee.codes/assets/home/toolsDetails/image3.png',
      tags: ['api', 'platform', 'devportal'],
    },
  ];
  
  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    return await createRouter({
      logger: env.logger,
      toolProvider: StaticExploreToolProvider.fromData(exploreTools),
    });
  }