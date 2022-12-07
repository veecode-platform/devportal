import { AxiosRequestHeaders } from 'axios';

export const kongHeaders = (
  kongAdminToken: string,
): AxiosRequestHeaders | undefined => {
  const header = {
    'Kong-Admin-Token': kongAdminToken,
  };
  return header;
};
