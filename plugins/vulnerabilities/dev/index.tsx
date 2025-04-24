import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { vulnerabilitiesPlugin, VulnerabilitiesPage } from '../src/plugin';

createDevApp()
  .registerPlugin(vulnerabilitiesPlugin)
  .addPage({
    element: <VulnerabilitiesPage />,
    title: 'Root Page',
    path: '/vulnerabilities',
  })
  .render();
