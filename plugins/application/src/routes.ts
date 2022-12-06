import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';


// services routes
export const servicesRootRouteRef = createRouteRef({
  id: 'services',
});

export const servicesDetailsRouteRef = createSubRouteRef({
  id: 'service-details',
  parent: servicesRootRouteRef,
  path: '/service-details'
});

export const createServicesRouteRef = createSubRouteRef({
  id: 'services-create',
  parent: servicesRootRouteRef,
  path: '/create-service'
});
export const editServicesRouteRef = createSubRouteRef({
  id: 'services-edit',
  parent: servicesRootRouteRef,
  path: '/edit-service'
});

// partners routes
export const partnersRootRouteRef = createRouteRef({
  id: 'partners',
});

export const partnersDetailsRouteRef = createSubRouteRef({
  id: 'partner-details',
  parent: partnersRootRouteRef,
  path: '/partner-details'
});

export const createPartnerRouteRef = createSubRouteRef({
  id: 'partners-create',
  parent: partnersRootRouteRef,
  path: '/create-partner'
});

// dev-application routes
export const applicationRouteRef = createRouteRef({
  id: 'application',
});

export const applicationDetailsRouteRef = createSubRouteRef({
  id: 'application-details',
  parent: applicationRouteRef,
  path: '/details'
});

export const newApplicationRouteRef = createSubRouteRef({
  id: 'application-new',
  parent: applicationRouteRef,
  path: '/new-application'
});

export const editApplicationRouteRef = createSubRouteRef({
  id: 'application-edit',
  parent: applicationRouteRef,
  path: '/edit-application'
});

// credentials
export const credentialRouteRef = createRouteRef({
  id: 'credentials',
});
export const credentialDetailsRouteRef = createSubRouteRef({
  id: 'credentials-details',
  parent: credentialRouteRef,
  path: '/details'
});

export const newCredentialRouteRef = createSubRouteRef({
  id: 'credentials-new',
  parent: credentialRouteRef,
  path: '/new-credential'
});

// export const editCredentialRouteRef = createSubRouteRef({
//   id: 'credential-edit',
//   parent: credentialRouteRef,
//   path: '/edit-credential'
// });

// export const removeCredentialRouteRef = createSubRouteRef({
//   id: 'credential-edit',
//   parent: credentialRouteRef,
//   path: '/remove-credential'
// });