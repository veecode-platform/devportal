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

import React, { ErrorInfo } from 'react';

import { ErrorPanel } from '@backstage/core-components';

import DynamicRootContext from '@red-hat-developer-hub/plugin-utils';

class ErrorBoundary extends React.Component<
  {
    Component: React.ComponentType<{ children?: React.ReactNode }>;
    children: React.ReactNode;
  },
  { error: any }
> {
  static getDerivedStateFromError(error: any) {
    return { error };
  }

  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { Component } = this.props;
    const name = Component.displayName ?? Component.name ?? 'Component';
    // eslint-disable-next-line no-console
    console.error(`Error in application/provider ${name}: ${error.message}`, {
      error,
      errorInfo,
      Component,
    });
  }

  render() {
    const { Component, children } = this.props;
    const { error } = this.state;
    if (error) {
      const name = Component.displayName ?? Component.name ?? 'Component';
      const title = `Error in application/provider ${name}: ${error.message}`;
      return (
        <>
          <ErrorPanel title={title} error={error} />
          {children}
        </>
      );
    }
    return <Component>{children}</Component>;
  }
}

export const ApplicationProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const { mountPoints } = React.useContext(DynamicRootContext);
  const providers = React.useMemo(
    () => mountPoints['application/provider'] ?? [],
    [mountPoints],
  );
  if (providers.length === 0) {
    return children;
  }
  return providers.reduceRight((acc, { Component }, index) => {
    return (
      <ErrorBoundary
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        Component={Component}
      >
        {acc}
      </ErrorBoundary>
    );
  }, children);
};
