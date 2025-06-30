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

import { Administration } from '@backstage-community/plugin-rbac';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BugReportIcon from '@material-ui/icons/BugReport';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InfoIcon from '@material-ui/icons/Info';
import LanguageIcon from '@material-ui/icons/Language';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import PeopleIcon from '@material-ui/icons/People';
import StorageIcon from '@material-ui/icons/Storage';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AddCircle from '@mui/icons-material/AddCircleOutline';
import Bookmarks from '@mui/icons-material/BookmarksOutlined';
import Business from '@mui/icons-material/BusinessOutlined';
import Category from '@mui/icons-material/CategoryOutlined';
import Cloud from '@mui/icons-material/CloudOutlined';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import Extension from '@mui/icons-material/ExtensionOutlined';
import Favorite from '@mui/icons-material/Favorite';
import FolderOpen from '@mui/icons-material/FolderOpenOutlined';
import GppGood from '@mui/icons-material/GppGoodOutlined';
import Help from '@mui/icons-material/HelpOutline';
import Home from '@mui/icons-material/HomeOutlined';
import InsertChart from '@mui/icons-material/InsertChartOutlined';
import Layers from '@mui/icons-material/Layers';
import List from '@mui/icons-material/List';
import Logout from '@mui/icons-material/LogoutOutlined';
import ManageAccounts from '@mui/icons-material/ManageAccountsOutlined';
import MonitorHeart from '@mui/icons-material/MonitorHeartOutlined';
import Notifications from '@mui/icons-material/NotificationsOutlined';
import People from '@mui/icons-material/People';
import QueryStats from '@mui/icons-material/QueryStatsOutlined';
import Rule from '@mui/icons-material/RuleOutlined';
import School from '@mui/icons-material/SchoolOutlined';
import Star from '@mui/icons-material/Star';
import Storefront from '@mui/icons-material/StorefrontOutlined';
import Textsms from '@mui/icons-material/TextsmsOutlined';

import { VeecodeLogoIcon } from './DevportalIcon';

const CommonIcons: {
  [k: string]: React.ComponentType<{}>;
} = {
  home: Home,
  group: People,
  category: Category,
  extension: Extension,
  school: School,
  add: AddCircle,
  list: List,
  layers: Layers,
  star: Star,
  favorite: Favorite,
  bookmarks: Bookmarks,
  queryStats: QueryStats,
  chart: InsertChart,
  business: Business,
  storefront: Storefront,
  folder: FolderOpen,
  cloud: Cloud,
  monitor: MonitorHeart,
  feedback: Textsms,
  validate: Rule,
  security: GppGood,
  support: Help,
  notifications: Notifications,
  manageAccounts: ManageAccounts,
  veecodeIcon: VeecodeLogoIcon,
  library: LibraryBooks,
  groups: PeopleIcon,
  signOut: ExitToAppIcon,
  environment: LanguageIcon,
  about: InfoIcon,
  contact: ContactMailIcon,
  admin: Administration,
  vulnerabilities: BugReportIcon,
  rbac: VpnKeyIcon,
  database: StorageIcon,
  cluster: AccountTreeIcon,
  event: CloudSyncIcon,
  logout: Logout,
  vault: VpnKeyIcon,
};

export default CommonIcons;
