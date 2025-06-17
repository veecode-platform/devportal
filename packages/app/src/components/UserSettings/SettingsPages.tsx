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

import { ErrorBoundary } from '@backstage/core-components';
import {
  AnyApiFactory,
  ApiRef,
  configApiRef,
  ProfileInfoApi,
  SessionApi,
  useApi,
  useApp,
} from '@backstage/core-plugin-api';
import {
  DefaultProviderSettings,
  ProviderSettingsItem,
  SettingsLayout,
  UserSettingsAuthProviders,
} from '@backstage/plugin-user-settings';

import Star from '@mui/icons-material/Star';
import { ProviderSetting } from '@red-hat-developer-hub/plugin-utils';

import { oidcAuthApiRef } from '../../apis';
import { GeneralPage } from './GeneralPage';

const DynamicProviderSettingsItem = ({
  title,
  description,
  provider,
}: {
  title: string;
  description: string;
  provider: string;
}) => {
  const app = useApp();
  // The provider API needs to be registered with the app
  const apiRef = app
    .getPlugins()
    .flatMap(plugin => Array.from(plugin.getApis()))
    .filter((api: AnyApiFactory) => api.api.id === provider)
    .at(0)?.api;
  if (!apiRef) {
    // eslint-disable-next-line no-console
    console.warn(
      `No API factory found for provider ref "${provider}", hiding the related provider settings UI`,
    );
    return <></>;
  }
  return (
    <ProviderSettingsItem
      title={title}
      description={description}
      apiRef={apiRef as ApiRef<ProfileInfoApi & SessionApi>}
      icon={Star}
    />
  );
};

const DynamicProviderSettings = ({
  providerSettings,
}: {
  providerSettings: ProviderSetting[];
}) => {
  const configApi = useApi(configApiRef);
  const providersConfig = configApi.getOptionalConfig('auth.providers');
  const configuredProviders = providersConfig?.keys() || [];
  return (
    <>
      <DefaultProviderSettings configuredProviders={configuredProviders} />
      {configuredProviders.includes('oidc') && (
        <ProviderSettingsItem
          title="OIDC"
          description="Provides authentication through an OIDC Provider"
          apiRef={oidcAuthApiRef}
          icon={Star}
        />
      )}
      {providerSettings.map(({ title, description, provider }) => (
        <ErrorBoundary>
          <DynamicProviderSettingsItem
            title={title}
            description={description}
            provider={provider}
          />
        </ErrorBoundary>
      ))}
    </>
  );
};

export const settingsPage = (providerSettings: ProviderSetting[]) => (
  <SettingsLayout>
    <SettingsLayout.Route path="general" title="General">
      <GeneralPage />
    </SettingsLayout.Route>
    <SettingsLayout.Route
      path="auth-providers"
      title="Authentication Providers"
    >
      <UserSettingsAuthProviders
        providerSettings={
          <DynamicProviderSettings providerSettings={providerSettings} />
        }
      />
    </SettingsLayout.Route>
  </SettingsLayout>
);
