import { Box } from '@material-ui/core';
import { HeaderComponent } from './headerComponent/HeaderComponent';
import { HomeGreeting } from './homeGretting/HomeGretting';
import { HomeContent } from './homeContent/HomeContent';

export const VeeCodeHomePage = () => {
  return (
    <Box component="main" sx={{ overflow: 'auto', height: '100vh' }}>
      <HeaderComponent />
      <HomeGreeting />
      <HomeContent />
    </Box>
  );
};
