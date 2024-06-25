import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createBackendModule } from '@backstage/backend-plugin-api';

import { parseJsonAction, createFileAction } from '@veecode-platform/backstage-plugin-scaffolder-backend-module-veecode-extensions';

export const scaffolderModuleCustomExtensions = createBackendModule({
  pluginId: 'scaffolder', 
  moduleId: 'veecode-platform-scaffolder-custom-extensions',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
      },
      async init({ scaffolder }) {

        const actions = [
          parseJsonAction(),
          createFileAction()
        ]

        scaffolder.addActions(...actions); 
      },
    });
  },
});