import { createPermission } from '@backstage/plugin-permission-common';

export const ADMIN_RESOURCE_TYPE = 'admin-entities';

export const adminAccessPermission = createPermission({
    name: 'admin.access.read',
    attributes: { action: 'read' },
});


export const apiManagmentEnabledPermission = createPermission({
    name: 'apiManagment.access.read',
    attributes: { action: 'read' },
});

export const adminAccessPermissions = [adminAccessPermission, apiManagmentEnabledPermission];