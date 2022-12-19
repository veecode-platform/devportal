import { createPermission } from '@backstage/plugin-permission-common';

export const ADMIN_RESOURCE_TYPE = 'admin-entities';

export const adminAccessPermission = createPermission({
    name: 'admin.access.read',
    attributes: { action: 'read' },
    //resourceType: ADMIN_RESOURCE_TYPE,
});

/*export const adminPartnersAccessPermission = createPermission({
    name: 'admin.partners.view',
    attributes: { action: 'read' },
});*/

export const adminAccessPermissions = [adminAccessPermission];
    