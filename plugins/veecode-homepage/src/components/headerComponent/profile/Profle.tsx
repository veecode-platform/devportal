import { IconButtonComponent } from '../iconButtonComponent/IconButtonComponent';
import { UserAvatar } from '../../userAvatar/UserAvatar';

interface ProfileProps {
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Profile: React.FC<ProfileProps> = ({ handleOpenMenu }) => {
  return (
    <IconButtonComponent
      title=""
      label="profile-menu"
      handleClick={handleOpenMenu}
      color="inherit"
    >
      <UserAvatar width="42px" height="42px" />
    </IconButtonComponent>
  );
};
