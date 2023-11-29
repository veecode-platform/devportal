import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { aboutPlugin, AboutPage } from '../src/plugin';

createDevApp()
  .registerPlugin(aboutPlugin)
  .addPage({
    element: <AboutPage />,
    title: 'Root Page',
    path: '/about'
  })
  .render();
