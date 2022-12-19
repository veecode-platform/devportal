/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// import { MyGroupsSidebarItem } from '@backstage/plugin-org';
import React, { useContext, PropsWithChildren } from 'react';
import { Link, makeStyles } from '@material-ui/core';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { NavLink } from 'react-router-dom';
import {
  // Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
//custom user-settings
import { Settings as SidebarSettings } from '../user-settings';
// import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarContext,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  // SidebarScrollWrapper,
  SidebarSpace,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import CatalogIcon from '@material-ui/icons/MenuBook';
import AppsIcon from '@material-ui/icons/Apps';
// import SearchIcon from '@material-ui/icons/Search';
import CategoryIcon from '@material-ui/icons/Category';
//import ClassIcon from '@material-ui/icons/Class';
// import RenderItem from '../Routing/RenderItem';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { adminAccessPermission } from '@internal/plugin-application-common';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useContext(SidebarContext);

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
      >
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};
export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />     
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={HomeIcon} to="/" text="Home" />    
        <SidebarItem icon={CatalogIcon} to="api-docs" text="Catalog" />   
        <SidebarDivider />
      </SidebarGroup>
      <RequirePermission permission={adminAccessPermission} errorPage={<></>}>
        <SidebarGroup label="Admin Flow" icon={<AppsIcon />}>
          <SidebarItem icon={AppsIcon} to="/services" text="Services" />
          <SidebarItem icon={CategoryIcon} to="/partners" text="Partners" />     
          <SidebarDivider />
        </SidebarGroup>
      </RequirePermission>

      <SidebarSpace />
      <SidebarDivider />
      <SidebarGroup
        label="Settings"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
