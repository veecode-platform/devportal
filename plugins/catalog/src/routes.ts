import {
  createExternalRouteRef,
  createRouteRef,
} from '@backstage/core-plugin-api';


export const createComponentRouteRef = createExternalRouteRef({
  id: 'create-component',
  optional: true,
});

export const viewTechDocRouteRef = createExternalRouteRef({
  id: 'view-techdoc',
  optional: true,
  params: ['namespace', 'kind', 'name'],
});

export const rootRouteRef = createRouteRef({
  id: 'catalog',
});
