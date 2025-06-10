import React, { PropsWithChildren } from 'react';
import { Badge, Link, makeStyles } from '@material-ui/core';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { NavLink } from 'react-router-dom';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import {
  Sidebar,
  sidebarConfig,
  useSidebarOpenState,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarSpace,
  SidebarSubmenu,
  SidebarSubmenuItem,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import CatalogIcon from '@material-ui/icons/MenuBook';
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import ExtensionIcon from '@material-ui/icons/Extension';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SignUpElement from './signOut';
import LanguageIcon from '@material-ui/icons/Language';
import InfoIcon from '@material-ui/icons/Info';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { sideBarBehaviour, sidebarDefaultType } from './sideBarSchema';
import { VeecodeLogoIcon } from './DevportalIcon';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { useAppContext } from '../../context/AppProvider';
import { Administration } from '@backstage-community/plugin-rbac';
import BugReportIcon from '@material-ui/icons/BugReport';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import StorageIcon from '@material-ui/icons/Storage';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

const useStyles = makeStyles({
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
  item: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: '1.2rem',
    left: '1.5rem',
  }
});

const SidebarLogo = () => {
  const classes = useStyles();
  const { isOpen } = useSidebarOpenState();
  const config = useApi(configApiRef);
  const logoFullSrc = config.getOptionalString("platform.logo.full") ?? "https://platform.vee.codes/assets/logo/logo.png"
  const logoIconSrc = config.getOptionalString("platform.logo.icon") ?? "https://platform.vee.codes/apple-touch-icon.png"

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
      >
        {isOpen ? <LogoFull src={logoFullSrc} /> : <LogoIcon src={logoIconSrc} />}
      </Link>
    </div>
  );
};
type sideBarDefaultGroupProps = {
  behaviour: sidebarDefaultType
  apiManagementEnabled?: boolean
}

const SideBarDefaultGroup = ({ behaviour }: sideBarDefaultGroupProps) => {
  return (
    <SidebarGroup label="Menu" icon={<MenuIcon />}>
      {behaviour.home ? (
        <SidebarItem icon={HomeIcon} to="/" text="Home" />
      ) : null}
      {behaviour.resources ? (
        <SidebarItem icon={VeecodeLogoIcon} text="Resources">
          <SidebarSubmenu title="">
            <SidebarDivider />
            <SidebarSubmenuItem
              title="Environments"
              to="environments-explorer"
              icon={LanguageIcon}
            />
            <SidebarSubmenuItem
              title="Clusters"
              to="cluster-explorer"
              icon={AccountTreeIcon}
            />
            <SidebarSubmenuItem
              title="Databases"
              to="database-explorer"
              icon={StorageIcon}
            />
            <SidebarSubmenuItem
              title="Vault"
              to="vault-explorer"
              icon={VpnKeyIcon}
            />
            <SidebarDivider />
          </SidebarSubmenu>
        </SidebarItem>
      ) : null}
      {behaviour.catalog ? (
        <SidebarItem icon={CatalogIcon} to="catalog" text="Catalog" />
      ) : null}
      {behaviour.apis ? (
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
      ) : null}
      {behaviour.create ? (
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create" />
      ) : null}
      {behaviour.docs ? (
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
      ) : null}
      {behaviour.groups ? (
        <SidebarItem icon={PeopleIcon} to="explore/groups" text="Groups" />
      ) : null}
      <SidebarItem
        icon={BugReportIcon}
        to={'/vulnerabilities'}
        text={'Vulnerabilities'}
      />
      <SidebarDivider />
    </SidebarGroup>
  );
}

export const Root = ({ children }: PropsWithChildren<{}>) => {
  const config = useApi(configApiRef);
  const devportalBehaviour = sideBarBehaviour(config.getConfig("platform.behaviour"))
  const { hasSupport } = useAppContext();
  const classes = useStyles();

  return (
    <SidebarPage>
      <Sidebar>
        <SidebarLogo />
        <SidebarDivider />
        <SideBarDefaultGroup behaviour={devportalBehaviour} />
        <SidebarGroup label="Settings" icon={<UserSettingsSignInAvatar />} to="/settings">
          <Administration />
          <SidebarSettings />
        </SidebarGroup>
        <SidebarItem icon={InfoIcon} to="/about" text="About" />
        <SidebarSpace />
        <SidebarDivider />
        <SidebarItem icon={ContactMailIcon} to="/support" text="Support" className={classes.item}>
          {
            hasSupport && (
              <Badge
                badgeContent=" "
                color="error"
                overlap='circular'
                className={classes.badge}
                variant='dot'
              />
            )
          }
        </SidebarItem>
        <SidebarDivider />
        {devportalBehaviour.signOut ? <SidebarGroup label="Sign Out" icon={<ExitToAppIcon />}>
          <SignUpElement />
        </SidebarGroup> : null}
      </Sidebar>
      {children}
    </SidebarPage>
  )
};