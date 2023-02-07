// class to access kong api manager service
import axios from 'axios';
import { Application, ApplicationProps } from '../applications/domain/Application';
import { PostgresApplicationRepository } from '../applications/repositories/knex/KnexApplicationRepository';
import { credential } from './Credential';
import { RouterOptions } from '../../service/router';
import { CredentialsOauth } from '../kong/services/CredentialsOauth';
import { PlatformConfig } from '../utils/PlatformConfig';


export enum security {
  oauth = 'oauth2',
  key_auth = 'key_auth'
}

type Service = {
  name: string;
  id: string;
};




export class KongHandler{
  
  
  public async listServices(): Promise<Service[]> {
    const config = await PlatformConfig.Instance.getConfig();
    const kong = config.getString('kong.api-manager');
    const url = `${kong}/services`
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
    console.log('response data: ', response.data)
    return response.data;
  }

  public async generateCredential(options: RouterOptions, kongUrl: string, idApplication: string, typeSecurity: security) {
    const applicationRepository = await PostgresApplicationRepository.create(
      await options.database.getClient(),
    );
    const credentialsOauth = new CredentialsOauth();
    const application: ApplicationProps = await applicationRepository.getApplicationById(idApplication) as ApplicationProps;
    if(typeSecurity.toString() == 'key_auth'){
      const url = `${kongUrl}/consumers/${application.externalId}/key-auth`
      const response = await axios.post(url);
      console.log(response)
      return response.data;
    }else if(typeSecurity.toString() == 'oauth2'){
      const response = await credentialsOauth.generateCredentials(`${application.externalId}`, application.externalId)
      console.log(response)
      return response;
    }
  }


  async listCredentialWithApplication(options: RouterOptions, kongUrl: string, id: string) {
  
    const applicationRepository = await PostgresApplicationRepository.create(
      await options.database.getClient(),
    );

    const application: ApplicationProps = await applicationRepository.getApplicationById(id) as ApplicationProps;
    const url =  `${kongUrl}/consumers/${application.externalId}/key-auth`
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

  public async removeCredencial(options: RouterOptions, kongUrl: string, idApplication: string, idCredencial: string) {
    const applicationRepository = await PostgresApplicationRepository.create(
      await options.database.getClient(),
    );
    const application: Application = await applicationRepository.getApplicationById(idApplication) as Application
    const url = `${kongUrl}/consumers/${application.externalId}/key-auth/${idCredencial}`

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
