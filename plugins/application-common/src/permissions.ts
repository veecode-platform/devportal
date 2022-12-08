import { createPermission } from '@backstage/plugin-permission-common';

export const adminAccessPermission = createPermission({
    name: 'admin.access.view',
    attributes: { action: 'read' },
});

/*export const adminPartnersAccessPermission = createPermission({
    name: 'admin.partners.view',
    attributes: { action: 'read' },
});*/

export const adminServicesPermissions = [adminAccessPermission];
    