/*
 * Copyright Red Hat, Inc.
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

import { useUserProfile } from '@backstage/plugin-user-settings';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import AvatarImg from '../../assets/avatar.svg';

interface UserAvatarProps {
  width?: string;
  height?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ width, height }) => {
  const { profile, loading: profileLoading } = useUserProfile();

  return (
    <>
      {profileLoading ? (
        <Skeleton variant="circular" sx={{ width, height }} />
      ) : (
        <Avatar
          src={profile.picture ?? AvatarImg}
          sx={{ width, height, objectFit: 'cover' }}
          alt="Profile picture"
        />
      )}
    </>
  );
};
