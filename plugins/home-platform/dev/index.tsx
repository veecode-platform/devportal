import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { homePlugin, HomepageCompositionRoot } from '../src/plugin';

createDevApp()
  .registerPlugin(homePlugin)
  .addPage({
    element: <HomepageCompositionRoot />,
    title: 'Root Page',
    path: '/',
  })
  .render();
