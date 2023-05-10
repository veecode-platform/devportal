import React from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

type VisibleType = 'visible' | 'hidden' | 'disable';

export type UnregisterEntityOptions = {
  disableUnregister: boolean | VisibleType;
};

interface UnregisterEntityProps {
  unregisterEntityOptions?: UnregisterEntityOptions;
  isUnregisterAllowed: boolean;
  onUnregisterEntity: () => void;
  onClose: () => void;
}

export function UnregisterEntity(props: UnregisterEntityProps) {
  const {
    unregisterEntityOptions,
    isUnregisterAllowed,
    onUnregisterEntity,
    onClose,
  } = props;

  const isBoolean =
    typeof unregisterEntityOptions?.disableUnregister === 'boolean';

  const isDisabled =
    (!isUnregisterAllowed ||
      (isBoolean
        ? !!unregisterEntityOptions?.disableUnregister
        : unregisterEntityOptions?.disableUnregister === 'disable')) ??
    false;

  let unregisterButton = <></>;

  if (unregisterEntityOptions?.disableUnregister !== 'hidden') {
    unregisterButton = (
      <MenuItem
        onClick={() => {
          onClose();
          onUnregisterEntity();
        }}
        disabled={isDisabled}
      >
        <ListItemIcon>
          <CancelIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Unregister entity" />
      </MenuItem>
    );
  }

  return <>{unregisterButton}</>;
}