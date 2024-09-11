import { RootHealthService  } from '@backstage/backend-plugin-api';


export class MyRootHealthService implements RootHealthService {
  async getLiveness() {
    return { status: 200, payload: { status: 'ok' } };
  }

  async getReadiness() {
    return { status: 200, payload: { status: 'ok' } };
  }
}