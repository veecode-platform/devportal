import React, { useState } from 'react';
import { SidebarItem } from '@backstage/core-components';
import SignOutIcon from '@material-ui/icons/MeetingRoom';
import {
  configApiRef,
  identityApiRef,
  useApi,
  errorApiRef,
} from '@backstage/core-plugin-api';

const SignOutElement = () => {
  const identityApi = useApi(identityApiRef);
  const config = useApi(configApiRef);
  const errorApi = useApi(errorApiRef);
  const [loading, setLoading] = useState(false);

  const handleSessionLogout = async () => {
    try {
      setLoading(true);
      await identityApi.signOut();
    } catch (e: any) {
      errorApi.post(e);
    }
  };

  return (
    <SidebarItem
      icon={SignOutIcon}
      text="Sign Out"
      onClick={async () => {
        if (loading) return;
        if (config.getBoolean('platform.guest.enabled'))
          await identityApi.signOut();
        await handleSessionLogout();
      }}
    />
  );
};

export default SignOutElement;
