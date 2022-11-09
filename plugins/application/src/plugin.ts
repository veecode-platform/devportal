import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { servicesRootRouteRef, servicesDetailsRouteRef, createServicesRouteRef, partnersRootRouteRef, partnersDetailsRouteRef, createPartnerRouteRef } from './routes';

export const applicationPlugin = createPlugin({
  id: 'application',
  routes: {
    servicesRoot: servicesRootRouteRef,
    servicesdetails: servicesDetailsRouteRef,
    servicesCreate: createServicesRouteRef,
    partnersRoot: partnersRootRouteRef,
    partnersDetails: partnersDetailsRouteRef,
    partnersCreate: createPartnerRouteRef
  },
});

export const ServicesPage = applicationPlugin.provide(
  createRoutableExtension({
    name: 'ServicesPage',
    component: () =>
      import('./components/services/ServicesPageComponent').then(m => m.ServicesPageComponent),
    mountPoint: servicesRootRouteRef,
  }),
);

export const PartnersPage = applicationPlugin.provide(
  createRoutableExtension({
    name: 'PartnersPage',
    component: () =>
      import('./components/partners/PartnersPageComponent').then(m => m.PartnersPageComponent),
    mountPoint: partnersRootRouteRef,
  }),
);
