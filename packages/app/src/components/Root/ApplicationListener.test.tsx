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

import * as React from 'react';
import { useLocation } from 'react-router-dom';

import { renderInTestApp } from '@backstage/test-utils';

import DynamicRootContext, {
  MountPoints,
} from '@red-hat-developer-hub/plugin-utils';

import { ApplicationListener } from './ApplicationListener';

const MountPointProvider = ({
  mountPoints,
  children,
}: {
  mountPoints: MountPoints;
  children: React.ReactNode;
}) => {
  const value = React.useMemo(() => ({ mountPoints }), [mountPoints]);
  return (
    <DynamicRootContext.Provider value={value as any}>
      {children}
    </DynamicRootContext.Provider>
  );
};

const TestListener = () => {
  const loc = useLocation();
  return <div>{loc.pathname}</div>;
};

const TestComponent = () => {
  return <p>Hello!</p>;
};

describe('ApplicationListener', () => {
  it('should render the UI when there are no listeners', async () => {
    const mountPoints = {
      'application/listener': [],
    };
    const { getByText } = await renderInTestApp(
      <MountPointProvider mountPoints={mountPoints}>
        <ApplicationListener />
        <TestComponent />
      </MountPointProvider>,
    );
    expect(getByText('Hello!')).toBeTruthy();
  });

  it('should return the UI when the listener throws an error', async () => {
    const mountPoints = {
      'application/listener': [
        {
          Component: () => {
            throw new Error('Listener failed to render');
          },
        },
      ],
    };
    const { getByText } = await renderInTestApp(
      <MountPointProvider mountPoints={mountPoints}>
        <ApplicationListener />
        <TestComponent />
      </MountPointProvider>,
    );
    expect(getByText('Hello!')).toBeInTheDocument();
  });

  it('should render the UI when one of the listeners throw an error', async () => {
    const mountPoints = {
      'application/listener': [
        {
          Component: () => {
            throw new Error('Listener failed to render');
          },
        },
        {
          Component: TestListener,
        },
      ],
    };
    const { getByText } = await renderInTestApp(
      <MountPointProvider mountPoints={mountPoints}>
        <ApplicationListener />
        <TestComponent />
      </MountPointProvider>,
    );
    expect(getByText('Hello!')).toBeInTheDocument();
    expect(getByText('/')).toBeInTheDocument();
  });

  it('should return the UI', async () => {
    const mountPoints = {
      'application/listener': [
        {
          Component: TestListener,
        },
      ],
    };
    const { getByText } = await renderInTestApp(
      <MountPointProvider mountPoints={mountPoints}>
        <ApplicationListener />
        <TestComponent />
      </MountPointProvider>,
    );
    expect(getByText('Hello!')).toBeInTheDocument();
    expect(getByText('/')).toBeInTheDocument();
  });
});
