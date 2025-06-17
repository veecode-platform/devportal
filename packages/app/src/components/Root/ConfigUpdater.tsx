/*
 * Portions of this file are based on code from the Red Hat Developer project:
 * https://github.com/redhat-developer/rhdh/blob/main/packages/app
 *
 * Original Copyright (c) 2022 Red Hat Developer (or the exact copyright holder from the original source, please verify in their repository)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';

import { configApiRef, useApi } from '@backstage/core-plugin-api';

const ConfigUpdater: React.FC = () => {
  const configApi = useApi(configApiRef);

  useEffect(() => {
    const updateConfig = () => {
      const logoIconBase64URI = configApi.getOptionalString(
        'app.branding.iconLogo',
      );

      if (logoIconBase64URI) {
        const favicon = document.getElementById(
          'dynamic-favicon',
        ) as HTMLLinkElement;
        if (favicon) {
          favicon.href = logoIconBase64URI;
        } else {
          const newFavicon = document.createElement('link');
          newFavicon.id = 'dynamic-favicon';
          newFavicon.rel = 'icon';
          newFavicon.href = logoIconBase64URI;
          document.head.appendChild(newFavicon);
        }
      }
    };

    updateConfig();
  }, [configApi]);

  return null;
};

export default ConfigUpdater;
