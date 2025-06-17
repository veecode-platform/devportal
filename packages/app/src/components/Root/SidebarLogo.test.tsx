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

import { BrowserRouter } from 'react-router-dom';

import { useSidebarOpenState } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

import { render } from '@testing-library/react';

import { SidebarLogo } from './SidebarLogo';

jest.mock('@backstage/core-components', () => ({
  ...jest.requireActual('@backstage/core-components'),
  useSidebarOpenState: jest.fn(),
}));

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

jest.mock('./LogoFull.tsx', () => () => (
  <svg data-testid="default-full-logo" />
));
jest.mock('./LogoIcon.tsx', () => () => (
  <svg data-testid="default-icon-logo" />
));

describe('SidebarLogo', () => {
  it('when sidebar is open renders the component with full logo base64 provided by config', () => {
    (useApi as any).mockReturnValue({
      getOptionalString: jest.fn().mockReturnValue('fullLogoBase64URI'),
      getOptional: jest.fn().mockReturnValue('fullLogoWidth'),
    });

    (useSidebarOpenState as any).mockReturnValue({ isOpen: true });
    const { getByTestId } = render(
      <BrowserRouter>
        <SidebarLogo />
      </BrowserRouter>,
    );

    const fullLogo = getByTestId('home-logo');
    expect(fullLogo).toBeInTheDocument();
    expect(fullLogo).toHaveAttribute('src', 'fullLogoBase64URI'); // Check the expected attribute value
  });

  it('when sidebar is open renders the component with default full logo if config is undefined', () => {
    (useApi as any).mockReturnValue({
      getOptionalString: jest.fn().mockReturnValue(undefined),
      getOptional: jest.fn().mockReturnValue(undefined),
    });

    (useSidebarOpenState as any).mockReturnValue({ isOpen: true });
    const { getByTestId } = render(
      <BrowserRouter>
        <SidebarLogo />
      </BrowserRouter>,
    );

    expect(getByTestId('default-full-logo')).toBeInTheDocument();
  });

  it('when sidebar is closed renders the component with icon logo base64 provided by config', () => {
    (useApi as any).mockReturnValue({
      getOptionalString: jest.fn().mockReturnValue('iconLogoBase64URI'),
      getOptional: jest.fn().mockReturnValue('fullLogoWidth'),
    });

    (useSidebarOpenState as any).mockReturnValue({ isOpen: false });
    const { getByTestId } = render(
      <BrowserRouter>
        <SidebarLogo />
      </BrowserRouter>,
    );

    const fullLogo = getByTestId('home-logo');
    expect(fullLogo).toBeInTheDocument();
    expect(fullLogo).toHaveAttribute('src', 'iconLogoBase64URI');
  });

  it('when sidebar is closed renders the component with icon logo from default if not provided with config', () => {
    (useApi as any).mockReturnValue({
      getOptionalString: jest.fn().mockReturnValue(undefined),
      getOptional: jest.fn().mockReturnValue(undefined),
    });

    (useSidebarOpenState as any).mockReturnValue({ isOpen: false });
    const { getByTestId } = render(
      <BrowserRouter>
        <SidebarLogo />
      </BrowserRouter>,
    );

    expect(getByTestId('default-icon-logo')).toBeInTheDocument();
  });
});
