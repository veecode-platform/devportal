// class to access kong api manager service
import axios from 'axios';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { ApplicationProps } from '../applications/domain/Application';
import { PostgresApplicationRepository } from '../applications/repositories/knex/KnexApplicationRepository';
import { credential } from './Credential';
import { RouterOptions } from '../../service/router';


type Service = {
  name: string;
  id: string;
};

export type DataBaseOptions = {
  database: PluginDatabaseManager;
}
export class KongHandler {
  public async listServices(kongUrl: string): Promise<Service[]> {
    const url = `${kongUrl}/services`
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response
      ? servicesStore.map((service: Service) => {
        return { name: service.name, id: service.id };
      })
      : [];
  }

  public async listRoutes(kongUrl: string): Promise<Service[]> {
    const url = `${kongUrl}/routes`
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response
      ? servicesStore.map((service: Service) => service.name)
      : [];
  }

  public async listConsumers(kongUrl: string) {
    const url = `${kongUrl}/consumers`
    const response = await axios.get(url);
    const consumers = response.data;
    return consumers;
      
  }

  // PLUGINS
  public async applyPluginToRoute(
    kongUrl: string,
  ): Promise<Service[]> {
    const url = `${kongUrl}/services`
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response
      ? servicesStore.map((service: Service) => service.name)
      : [];
  }

  public async applyPluginToService(
    kongUrl: string,
    serviceName: string,
    pluginName: string,
  ): Promise<Service[]> {
    const url = `${kongUrl}/services/${serviceName}/plugins`;
    const response = await axios.post(url, {
      name: `${pluginName}`,
    });
    const servicesStore = response.data;
    return servicesStore;
  }
  public async updatePluginService(
    kongUrl: string,
    serviceName: string,
    pluginName: string,
  ): Promise<Service[]> {
    const url = `${kongUrl}/services/${serviceName}/plugins`;
    const response = await axios.post(url, {
      name: `${pluginName}`,
    });
    const servicesStore = response.data;
    return servicesStore;
  }

  public async listPluginsService(
    kongUrl: string,
    serviceName: string,
  ): Promise<Service[]> {
    const url = `${kongUrl}/services/${serviceName}/plugins`;
    const response = await axios.get(url);
    return response.data;
  }

  public async generateCredential(kongUrl: string, idConsumer: string) {
    const url = `${kongUrl}/consumers/${idConsumer}/key-auth`
    const response = await axios.post(url);
    return response.data;
  }


  async listCredentialWithApplication(options: RouterOptions, kongUrl: string, id: string) {
  
    const applicationRepository = await PostgresApplicationRepository.create(
      await options.database.getClient(),
    );

    const application: ApplicationProps = await applicationRepository.getApplicationById(id);
    const url =  `${kongUrl}/consumers/${application.kongConsumerId}/key-auth`
    const response = await axios.get(url);
    const list = response.data.data;
    const credentials: credential[] = []
    for (let index = 0; index < list.length; index++) {
      let credencial = new credential(list[index].id, list[index].key)
      credentials.push(credencial);
    }
    return credentials;
  }


  public async listCredential(kongUrl: string, idConsumer: string) {
    const url = `${kongUrl}/consumers/${idConsumer}/key-auth`
    const response = await axios.get(url);
    const list = response.data;
    const credentials: credential[] = []
    for (let index = 0; index < list.length; index++) {
      let credencial = new credential(list[index].id, list[index].key)
      credentials.push(credencial);
    }
    return credentials;
  }

  public async removeCredencial(kongUrl: string, idConsumer: string, idCredencial: string) {
    const url = `${kongUrl}/consumers/${idConsumer}/key-auth/${idCredencial}`

    const response = await axios.delete(url);
    return response.data;
  }

  public async deletePluginsService(
    kongUrl: string,
    serviceName: string,
    pluginId: string,
  ): Promise<Service[]> {
    const url = `${kongUrl}/services/${serviceName}/plugins/${pluginId}`;
    const response = await axios.delete(url);
    const servicesStore = response.data;
    return servicesStore;
  }
}
