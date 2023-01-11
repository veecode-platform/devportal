// class to access kong api manager service
import axios from 'axios';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { ApplicationProps } from '../applications/domain/Application';
import { PostgresApplicationRepository } from '../applications/repositories/knex/KnexApplicationRepository';
import { credential } from './Credential';


type Service = {
  name: string;
  id: string;
};

export type DataBaseOptions = {
  database: PluginDatabaseManager;
}
export class KongHandler {
  public async listServices(kongUrl: string, tls: boolean): Promise<Service[]> {
    const url = tls
      ? `https://${kongUrl}/services`
      : `http://${kongUrl}/services`;
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response
      ? servicesStore.map((service: Service) => {
        return { name: service.name, id: service.id };
      })
      : [];
  }

  public async listRoutes(tls: false, kongUrl: string): Promise<Service[]> {
    const url = tls
      ? `https://${kongUrl}/services`
      : `http://${kongUrl}/services`;
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response
      ? servicesStore.map((service: Service) => service.name)
      : [];
  }

  public async listConsumers(kongUrl: string, tls: false) {
    const url = tls
      ? `https://${kongUrl}/consumers`
      : `${kongUrl}/consumers`;
    const response = await axios.get(url);
    const consumers = response.data;
    return consumers;
      
  }

  // PLUGINS
  public async applyPluginToRoute(
    tls: false,
    kongUrl: string,
  ): Promise<Service[]> {
    const url = tls
      ? `https://${kongUrl}/services`
      : `http://${kongUrl}/services`;
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response
      ? servicesStore.map((service: Service) => service.name)
      : [];
  }

  public async applyPluginToService(
    tls: false,
    kongUrl: string,
    serviceName: string,
    pluginName: string,
  ): Promise<Service[]> {
    const url = tls
      ? `https://${kongUrl}/services/${serviceName}/plugins`
      : `http://${kongUrl}/services/${serviceName}/plugins`;
    const response = await axios.post(url, {
      name: `${pluginName}`,
    });
    const servicesStore = response.data;
    return servicesStore;
  }
  public async updatePluginService(
    tls: false,
    kongUrl: string,
    serviceName: string,
    pluginName: string,
  ): Promise<Service[]> {
    const url = tls
      ? `https://${kongUrl}/services/${serviceName}/plugins`
      : `http://${kongUrl}/services/${serviceName}/plugins`;
    const response = await axios.post(url, {
      name: `${pluginName}`,
    });
    const servicesStore = response.data;
    return servicesStore;
  }

  public async listPluginsService(
    tls: false,
    kongUrl: string,
    serviceName: string,
  ): Promise<Service[]> {
    const url = tls
      ? `https://${kongUrl}/services/${serviceName}/plugins`
      : `${kongUrl}/services/${serviceName}/plugins`;
    const response = await axios.get(url);
    return response.data;
  }

  public async generateCredential(tls: boolean, kongUrl: string, workspace: string, idConsumer: string) {
    const url = tls ? `https://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth` : `http://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth`
    const response = await axios.post(url);
    return response.data;
  }


  async listCredentialWithApplication(dataBaseOptions: PluginDatabaseManager, id: string, workspace: string, kongUrl: string, tls: boolean) {
    const applicationRepository = await PostgresApplicationRepository.create(
      await dataBaseOptions.getClient(),
    );

    const application: ApplicationProps = await applicationRepository.getApplicationById(id);

    const url = tls ? `https://${kongUrl}/${workspace}/consumers/${application.kongConsumerId}/key-auth` : `http://${kongUrl}/${workspace}/consumers/${application.kongConsumerId}/key-auth`
    console.log("AQUI ", url)
    const response = await axios.get(url);
    const list = response.data.data;
    const credentials: credential[] = []
    for (let index = 0; index < list.length; index++) {
      let credencial = new credential(list[index].id, list[index].key)
      credentials.push(credencial);
    }
    return credentials;
  }


  public async listCredential(tls: boolean, kongUrl: string, workspace: string, idConsumer: string) {
    const url = tls ? `https://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth` : `http://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth`
    console.log("AQUI ", url)
    const response = await axios.get(url);
    const list = response.data;
    const credentials: credential[] = []
    for (let index = 0; index < list.length; index++) {
      let credencial = new credential(list[index].id, list[index].key)
      credentials.push(credencial);
    }
    return credentials;
  }

  public async removeCredencial(tls: boolean, kongUrl: string, workspace: string, idConsumer: string, idCredencial: string) {
    const url = tls ? `https://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth/${idCredencial}` : `http://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth/${idCredencial}`

    const response = await axios.delete(url);
    return response.data;
  }

  public async deletePluginsService(
    tls: false,
    kongUrl: string,
    serviceName: string,
    pluginId: string,
  ): Promise<Service[]> {
    const url = tls
      ? `https://${kongUrl}/services/${serviceName}/plugins/${pluginId}`
      : `http://${kongUrl}/services/${serviceName}/plugins/${pluginId}`;
    const response = await axios.delete(url);
    const servicesStore = response.data;
    return servicesStore;
  }
}
