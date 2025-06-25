import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { UserAvatar } from '../userAvatar/UserAvatar';
import Typography from '@mui/material/Typography';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useUserProfile } from '@backstage/plugin-user-settings';
import Skeleton from '@mui/material/Skeleton';
import { useEffect, useState } from 'react';
import WavesImg from '../../assets/waves.svg';

export const HomeGreeting = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { displayName } = useUserProfile();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const configApi = useApi(configApiRef);
  const color1 =
    (isDarkMode
      ? configApi.getOptionalString('app.branding.theme.dark.headerColo1')
      : configApi.getOptionalString('app.branding.theme.light.headerColo1')) ??
    '#45556D';
  const color2 =
    (isDarkMode
      ? configApi.getOptionalString('app.branding.theme.dark.headerColo2')
      : configApi.getOptionalString('app.branding.theme.light.headerColo2')) ??
    '#86F4CE';

  const profileDisplayName = () => {
    const name = displayName;
    const regex = /^[^:/]+:[^/]+\/[^/]+$/;
    if (regex.test(name)) {
      return name
        .charAt(name.indexOf('/') + 1)
        .toLocaleUpperCase('en-US')
        .concat(name.substring(name.indexOf('/') + 2));
    }
    return name;
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <Box
      sx={{
        background: `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`,
        width: '100%',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        [theme.breakpoints.only('xs')]: {
          height: 'auto',
        },
      }}
    >
      <Box
        sx={{
          width: '90%',
          margin: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          [theme.breakpoints.only('xs')]: {
            flexDirection: 'column',
            padding: '1rem 0',
          },
        }}
      >
        <Box>
          <UserAvatar width="120px" height="120px" />
        </Box>
        <Box color={theme.palette.grey[100]}>
          <Typography variant="h3">
            Welcome back
            {loading ? (
              <Skeleton
                variant="rectangular"
                width={130}
                height={60}
                style={{ display: 'inline' }}
              />
            ) : (
              <>, {profileDisplayName()} 👋</>
            )}{' '}
          </Typography>
          <Typography variant="h6">Let's get started.</Typography>
        </Box>
      </Box>
      <img
        src={WavesImg}
        alt=""
        style={{
          width: '100%',
          height: '250px',
          objectFit: 'cover',
          position: 'absolute',
          top: '-20%',
          left: '0',
          opacity: '0.7',
        }}
      />
    </Box>
  );
};
