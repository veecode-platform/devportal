/*
 * Portions of this file are based on code from the Red Hat Developer project:
 * https://github.com/redhat-developer/rhdh/blob/main
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

import { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';

import { DynamicRootContext } from '../context';
import useMountPoints from './useMountPoints';

// Mock context values
const mockMountPoints = {
  'header-nav': { component: 'HeaderNav', props: {} },
  'sidebar-menu': { component: 'SidebarMenu', props: {} },
  'main-content': { component: 'MainContent', props: {} },
};

const mockContextValue = {
  mountPoints: mockMountPoints,
  dynamicRoutes: [],
  entityTabOverrides: {},
  menuItems: [],
  providerSettings: {},
  scaffolderFieldExtensions: {},
  techdocsAddons: {},
};

// Test wrapper with context provider
const createWrapper =
  (contextValue: any) =>
  ({ children }: { children: ReactNode }) => (
    <DynamicRootContext.Provider value={contextValue}>
      {children}
    </DynamicRootContext.Provider>
  );

describe('useMountPoints', () => {
  it('should return the correct mount point when it exists', () => {
    const wrapper = createWrapper(mockContextValue);
    const { result } = renderHook(() => useMountPoints('header-nav'), {
      wrapper,
    });

    expect(result.current).toEqual(mockMountPoints['header-nav']);
  });

  it('should return another mount point correctly', () => {
    const wrapper = createWrapper(mockContextValue);
    const { result } = renderHook(() => useMountPoints('sidebar-menu'), {
      wrapper,
    });

    expect(result.current).toEqual(mockMountPoints['sidebar-menu']);
  });

  it('should throw error when mount point does not exist', () => {
    const wrapper = createWrapper(mockContextValue);

    expect(() => {
      renderHook(() => useMountPoints('non-existent'), { wrapper });
    }).toThrow('Mount point "non-existent" not found!');
  });

  it('should throw error when mountPointId is empty string', () => {
    const wrapper = createWrapper(mockContextValue);

    expect(() => {
      renderHook(() => useMountPoints(''), { wrapper });
    }).toThrow('mountPointId is required');
  });

  it('should throw error when context value is null', () => {
    const wrapper = createWrapper(null);

    expect(() => {
      renderHook(() => useMountPoints('header-nav'), { wrapper });
    }).toThrow('useMountPoints must be used within a DynamicPluginProvider');
  });

  it('should throw error when mountPoints is undefined in context', () => {
    const contextWithoutMountPoints = {
      ...mockContextValue,
      mountPoints: undefined,
    };
    const wrapper = createWrapper(contextWithoutMountPoints);

    expect(() => {
      renderHook(() => useMountPoints('header-nav'), { wrapper });
    }).toThrow('Mount point "header-nav" not found!');
  });

  it('should throw error when mountPoints is empty object', () => {
    const contextWithEmptyMountPoints = {
      ...mockContextValue,
      mountPoints: {},
    };
    const wrapper = createWrapper(contextWithEmptyMountPoints);

    expect(() => {
      renderHook(() => useMountPoints('header-nav'), { wrapper });
    }).toThrow('Mount point "header-nav" not found!');
  });
});
