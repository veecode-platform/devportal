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

import { configApiRef } from '@backstage/core-plugin-api';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';

import { userEvent } from '@testing-library/user-event';

import { InfoCard } from './InfoCard';

describe('InfoCard', () => {
  it('should render essential versions by default', async () => {
    const mockConfig = mockApis.config({
      data: {
        buildInfo: {},
      },
    });
    const renderResult = await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        <InfoCard />
      </TestApiProvider>,
    );
    expect(renderResult.getByText(/RHDH Version/)).toBeInTheDocument();
    expect(renderResult.getByText(/Backstage Version/)).toBeInTheDocument();
  });

  it('should hide the build time by default and show it on click', async () => {
    const mockConfig = mockApis.config({
      data: {
        buildInfo: {},
      },
    });
    const renderResult = await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        <InfoCard />
      </TestApiProvider>,
    );
    expect(renderResult.queryByText(/Last Commit/)).toBeNull();
    await userEvent.click(renderResult.getByText(/RHDH Version/));
    expect(renderResult.getByText(/Last Commit/)).toBeInTheDocument();
  });

  it('should render the customized values when build info is configured', async () => {
    const mockConfig = mockApis.config({
      data: {
        buildInfo: {
          title: 'RHDH Build info',
          card: {
            'TechDocs builder': 'local',
            'Authentication provider': 'Github',
            RBAC: 'disabled',
          },
        },
      },
    });
    const renderResult = await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        <InfoCard />
      </TestApiProvider>,
    );
    expect(renderResult.queryByText(/TechDocs builder/)).toBeInTheDocument();
    expect(
      renderResult.queryByText(/Authentication provider/),
    ).toBeInTheDocument();
    await userEvent.click(renderResult.getByText(/TechDocs builder/));
    expect(renderResult.getByText(/RBAC/)).toBeInTheDocument();
    expect(renderResult.queryByText(/Last Commit/)).not.toBeInTheDocument();
  });

  it('should append the customized values along with RHDH versions when build info is configured with `full` set to false', async () => {
    const mockConfig = mockApis.config({
      data: {
        buildInfo: {
          title: 'RHDH Build info',
          card: {
            'TechDocs builder': 'local',
            'Authentication provider': 'Github',
            RBAC: 'disabled',
          },
          full: false,
        },
      },
    });
    const renderResult = await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        <InfoCard />
      </TestApiProvider>,
    );
    expect(renderResult.queryByText(/TechDocs builder/)).toBeInTheDocument();
    expect(
      renderResult.queryByText(/Authentication provider/),
    ).toBeInTheDocument();
    await userEvent.click(renderResult.getByText(/TechDocs builder/));
    expect(renderResult.getByText(/RBAC/)).toBeInTheDocument();
    expect(renderResult.queryByText(/Last Commit/)).toBeInTheDocument();
    expect(renderResult.queryByText(/RHDH Version/)).toBeInTheDocument();
  });

  it('should display only the customized values when build info is configured with full set to true, without appending RHDH versions', async () => {
    const mockConfig = mockApis.config({
      data: {
        buildInfo: {
          title: 'RHDH Build info',
          card: {
            'TechDocs builder': 'local',
            'Authentication provider': 'Github',
            RBAC: 'disabled',
          },
          full: true,
        },
      },
    });
    const renderResult = await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        <InfoCard />
      </TestApiProvider>,
    );
    expect(renderResult.queryByText(/TechDocs builder/)).toBeInTheDocument();
    expect(
      renderResult.queryByText(/Authentication provider/),
    ).toBeInTheDocument();
    await userEvent.click(renderResult.getByText(/TechDocs builder/));
    expect(renderResult.getByText(/RBAC/)).toBeInTheDocument();
    expect(renderResult.queryByText(/Last Commit/)).not.toBeInTheDocument();
  });

  it('should fallback to default json if the customized card value is empty', async () => {
    const mockConfig = mockApis.config({
      data: {
        buildInfo: {
          title: 'RHDH Build info',
          card: undefined,
        },
      },
    });
    const renderResult = await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        <InfoCard />
      </TestApiProvider>,
    );
    expect(
      renderResult.queryByText(/TechDocs builder/),
    ).not.toBeInTheDocument();
    expect(renderResult.getByText(/RHDH Version/)).toBeInTheDocument();
    expect(renderResult.getByText(/Backstage Version/)).toBeInTheDocument();
  });
});
