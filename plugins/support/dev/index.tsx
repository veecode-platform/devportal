import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { supportPlugin, SupportPage } from '../src/plugin';

createDevApp()
  .registerPlugin(supportPlugin)
  .addPage({
    element: <SupportPage />,
    title: 'Root Page',
    path: '/support'
  })
  .render();
