import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { signInPlugin, SignInPage} from '../src/plugin';

createDevApp()
  .registerPlugin(signInPlugin)
  .addPage({
    element: <SignInPage />,
    title: 'Root Page',
    path: '/sign-in'
  })
  .render();