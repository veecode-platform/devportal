/* eslint-disable no-restricted-syntax */
import { useState, useEffect, useMemo } from 'react';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircularProgress from '@mui/material/CircularProgress';
import {
  GetNotificationsOptions,
  GetNotificationsResponse,
  GetTopicsResponse,
  useNotificationsApi,
} from '@backstage/plugin-notifications';
import {
  NotificationSeverity,
  NotificationStatus,
} from '@backstage/plugin-notifications-common';
import { useSignal } from '@backstage/plugin-signals-react';
import throttle from 'lodash/throttle';
import { IconButtonComponent } from '../iconButtonComponent/IconButtonComponent';

const ThrottleDelayMs = 2000;

export const Notifications = () => {
  const [unreadOnly] = useState<boolean | undefined>(true);
  const [saved] = useState<boolean | undefined>(undefined);
  const [severity] = useState<NotificationSeverity>('low');
  const [topic] = useState<string>();

  const { lastSignal } = useSignal('notifications');

  const { error, value, retry, loading } = useNotificationsApi<
    [GetNotificationsResponse, NotificationStatus, GetTopicsResponse]
  >(
    api => {
      const options: GetNotificationsOptions = {
        minimumSeverity: severity,
      };

      if (unreadOnly !== undefined) {
        options.read = !unreadOnly;
      }
      if (saved !== undefined) {
        options.saved = saved;
      }
      if (topic !== undefined) {
        options.topic = topic;
      }

      return Promise.all([
        api.getNotifications(options),
        api.getStatus(),
        api.getTopics(options),
      ]);
    },
    [unreadOnly, severity, saved, topic],
  );

  const throttledRetry = useMemo(
    () => throttle(() => retry(), ThrottleDelayMs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const totalCount = value?.[1]?.unread ?? 0;

  useEffect(() => {
    if (lastSignal?.action) {
      throttledRetry();
    }
  }, [lastSignal, throttledRetry]);

  return (
    <IconButtonComponent
      title="Notifications"
      label={`Mostrar ${totalCount} notificações não lidas`}
      color="inherit"
      link="/notifications"
    >
      <Badge
        badgeContent={totalCount}
        color="error"
        invisible={loading || !!error || totalCount === 0}
      >
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <NotificationsIcon />
        )}
      </Badge>
    </IconButtonComponent>
  );
};
