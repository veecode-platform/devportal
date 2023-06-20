// import { MyGroupsSidebarItem } from '@backstage/plugin-org';
import React, { useContext, PropsWithChildren } from 'react'; 
import { Link, makeStyles } from '@material-ui/core';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { NavLink } from 'react-router-dom';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@veecode-platform/plugin-user-settings';
// import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarContext,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarSpace,
  // SidebarScrollWrapper,
  // SidebarSpace,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import CatalogIcon from '@material-ui/icons/MenuBook';
import AppsIcon from '@material-ui/icons/Apps';
import LibraryBooks from "@material-ui/icons/LibraryBooks";
// import SearchIcon from '@material-ui/icons/Search';
import ExtensionIcon from '@material-ui/icons/Extension';
// import CategoryIcon from '@material-ui/icons/Category';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import { usePermission } from '@backstage/plugin-permission-react';
import { adminAccessPermission, apiManagementEnabledPermission } from '@internal/plugin-application-common';
import CategoryIcon from '@material-ui/icons/Category';
import LayersIcon from '@material-ui/icons/Layers';
// import RenderItem from '../Routing/RenderItem';
// import AccountTreeIcon from '@material-ui/icons/AccountTree';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SignUpElement from './signUp';

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
  }
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
export const Root = ({ children }: PropsWithChildren<{}>) => {
  const { loading: loadingPermission, allowed: adminView } = usePermission({ permission: adminAccessPermission });
  const { loading: loadingApiEnabledPermission, allowed: enabledApiManagement } = usePermission({ permission: apiManagementEnabledPermission });

  return (
    <SidebarPage>
      <Sidebar>
        <SidebarLogo />
        <SidebarDivider />
        <SidebarGroup label="Menu" icon={<MenuIcon />}>
          <SidebarItem icon={HomeIcon} to="/" text="Home" />
          {(!loadingPermission && adminView) && (<>
            <SidebarItem icon={CatalogIcon} to="catalog" text="Catalog" />
            <SidebarItem icon={CreateComponentIcon} to="create" text="Create" />
          </> )}     
          <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
          {(!loadingPermission && adminView) && (
            <>
              <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
              <SidebarItem icon={PeopleIcon} to="explore/groups" text="Groups" />
            </>
          )}
          <SidebarDivider />
        </SidebarGroup>     
        {(!loadingApiEnabledPermission && enabledApiManagement) && (<>
          <SidebarGroup label="Api managment" icon={<AppsIcon />}>
            {(!loadingPermission && adminView) && (<>
              <SidebarItem icon={AppsIcon} to="/services" text="Services" />
              <SidebarItem icon={CategoryIcon} to="/partners" text="Partners" />
            </>)}
            <SidebarItem icon={LayersIcon} to="/applications" text="Applications" />
            <SidebarDivider />
          </SidebarGroup>
        </>)}

        <SidebarGroup
          label="Settings"
          icon={<UserSettingsSignInAvatar />}
          to="/settings"
        >
          <SidebarSettings />
        </SidebarGroup>
        <SidebarSpace />
        <SidebarDivider/>
        <SidebarGroup label="Sign Up" icon={<ExitToAppIcon />}>
            <SignUpElement/>
          </SidebarGroup>
       </Sidebar>
      {children}
    </SidebarPage>
  )
};
