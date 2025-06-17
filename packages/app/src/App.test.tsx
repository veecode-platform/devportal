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

import { lazy, Suspense } from 'react';

import { removeScalprum } from '@scalprum/core';
import { mockPluginData } from '@scalprum/react-test-utils';
import { render, waitFor } from '@testing-library/react';

import TestRoot from './utils/test/TestRoot';

const AppBase = lazy(() => import('./components/AppBase'));

describe('App', () => {
  beforeEach(() => {
    removeScalprum();
  });
  it('should render', async () => {
    const { TestScalprumProvider } = mockPluginData({}, {});
    process.env = {
      NODE_ENV: 'test',
      APP_CONFIG: [
        {
          data: {
            app: { title: 'Test' },
            backend: { baseUrl: 'http://localhost:7007' },
            auth: { environment: 'development' },
          },
          context: 'test',
        },
      ] as any,
    };

    const rendered = render(
      <TestScalprumProvider>
        <TestRoot>
          <Suspense fallback={null}>
            <AppBase />
          </Suspense>
        </TestRoot>
      </TestScalprumProvider>,
    );

    await waitFor(() => expect(rendered.baseElement).toBeInTheDocument());
  }, 100000);
});
