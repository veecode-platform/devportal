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
  envinroment: LanguageIcon,
  about: InfoIcon,
  contact: ContactMailIcon,
  admin: Administration,
  vulnerabilities: BugReportIcon,
  rbac: VpnKeyIcon,
  database: StorageIcon,
  cluster: AccountTreeIcon,
  logout: Logout,
};

export default CommonIcons;
