import { AxiosError } from 'axios';
import { KongConsumerBadRequest } from '../consumer/KongConsumerBadRequest';
import { KongConsumerForbidden } from '../consumer/KongConsumerForbidden';
import { KongConsumerInternalServer } from '../consumer/KongConsumerInternalServer';
import { KongConsumerNotFoud } from '../consumer/KongConsumerNotFoud';
import { KongConsumerUnauthorized } from '../consumer/KongConsumerUnauthorized';

export const kongConsumerExceptions = (error: AxiosError) => {
  const status = error.response?.status;
  const message = error.response?.statusText;
  switch (status) {
    case 400:
      throw new KongConsumerBadRequest(message ?? '', status);
    case 401:
      throw new KongConsumerUnauthorized(message ?? '', status);
    case 403:
      throw new KongConsumerForbidden(message ?? '', status);
    case 404:
      throw new KongConsumerNotFoud(message ?? '', status);
    case 500:
      throw new KongConsumerInternalServer(message ?? '', status);
    default:
      throw new AxiosError(message);
  }
};
