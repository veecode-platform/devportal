import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

/*export const rootRouteRef = createRouteRef({
  id: 'application',
});*/

//services routes
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

//partners routes
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
