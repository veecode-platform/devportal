import { createDevApp } from '@backstage/dev-utils';
import { veecodeHomepagePlugin, VeecodeHomepagePage } from '../src/plugin';

createDevApp()
  .registerPlugin(veecodeHomepagePlugin)
  .addPage({
    element: <VeecodeHomepagePage />,
    title: 'Root Page',
    path: '/veecode-homepage',
  })
  .render();
