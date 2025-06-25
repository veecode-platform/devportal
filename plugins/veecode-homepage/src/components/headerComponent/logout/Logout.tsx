import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';

export const Logout = () => {
  const identityApi = useApi(identityApiRef);

  return (
    <Box
      component="div"
      onClick={async () => {
        await identityApi.signOut();
      }}
    >
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      Log out
    </Box>
  );
};
