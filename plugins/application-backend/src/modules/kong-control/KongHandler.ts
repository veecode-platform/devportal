// class to access kong api manager service
import axios from 'axios';
import { Application, ApplicationProps } from '../applications/domain/Application';
import { PostgresApplicationRepository } from '../applications/repositories/knex/KnexApplicationRepository';

import { RouterOptions } from '../../service/router';
import { CredentialsOauth } from '../kong/services/CredentialsOauth';
import { KongServiceBase } from '../kong/services/KongServiceBase';
import { Credential } from './Credential';
import { CredentialOauth } from './CredentialOauth2';


export enum security {
  oauth = 'oauth2',
  key_auth = 'key_auth'
}

type Service = {
  name: string;
  id: string;
};




export class KongHandler extends KongServiceBase {


  public async listServices(): Promise<Service[]> {
    const url = `${await this.getUrl()}/services`
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response
      ? servicesStore.map((service: Service) => {
        return { name: service.name, id: service.id };
      })
      : [];
  }

  public async listRoutes(): Promise<Service[]> {
    const url = `${await this.getUrl()}/routes`
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response
      ? servicesStore.map((service: Service) => service.name)
      : [];
  }

  public async listConsumers() {
    const url = `${await this.getUrl()}/consumers`
    const response = await axios.get(url);
    const consumers = response.data;
    return consumers;

  }

  // PLUGINS
  public async applyPluginToRoute(
  ): Promise<Service[]> {
    const url = `${await this.getUrl()}/services`
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response
      ? servicesStore.map((service: Service) => service.name)
      : [];
  }

  public async applyPluginToService(
    serviceName: string,
    pluginName: string,
  ): Promise<Service[]> {
    const url = `${await this.getUrl()}/services/${serviceName}/plugins`;
    const response = await axios.post(url, {
      name: `${pluginName}`,
    });
    const servicesStore = response.data;
    return servicesStore;
  }
  public async updatePluginService(
    serviceName: string,
    pluginName: string,
  ): Promise<Service[]> {
    const url = `${await this.getUrl()}/services/${serviceName}/plugins`;
    const response = await axios.post(url, {
      name: `${pluginName}`,
    });
    const servicesStore = response.data;
    return servicesStore;
  }

  public async listPluginsService(
    serviceName: string,
  ): Promise<Service[]> {
    const url = `${await this.getUrl()}/services/${serviceName}/plugins`;
    const response = await axios.get(url);
    console.log('response data: ', response.data)
    return response.data;
  }

  public async generateCredential(options: RouterOptions, idApplication: string, typeSecurity: security) {
    const applicationRepository = await PostgresApplicationRepository.create(
      await options.database.getClient(),
    );
    const credentialsOauth = new CredentialsOauth();
    const application: ApplicationProps = await applicationRepository.getApplicationById(idApplication) as ApplicationProps;
    if (typeSecurity.toString() == 'key_auth') {

      const url = `${await this.getUrl()}/consumers/${application.externalId}/key-auth`
      const response = await axios.post(url);

      return response.data;
    } else if (typeSecurity.toString() == 'oauth2') {

      const response = await credentialsOauth.generateCredentials(`${application.externalId}`, application.externalId as string)

      return response;
    }
  }


  async listCredentialWithApplication(options: RouterOptions, id: string) {

    const applicationRepository = await PostgresApplicationRepository.create(
      await options.database.getClient(),
    );
    console.log('aqui')
    const application: ApplicationProps = await applicationRepository.getApplicationById(id) as ApplicationProps;
    console.log('app', application)
    const url = `${await this.getUrl()}/consumers/${application.externalId}/key-auth`
    const urlOath = `${await this.getUrl()}/consumers/${application.externalId}/oauth2`
    console.log('KEY_AUTH', url)
    console.log('OAUTH 2', urlOath)
    const response = await axios.get(url);
    const responseOauth = await axios.get(urlOath);
    const keyauths = response.data.data;
    const keyoauth = responseOauth.data.data;
    const credentials: any[] = []
    for (let index = 0; index < keyauths.length; index++) {
      let credencial = new Credential(keyauths[index].id, keyauths[index].key, "key_auth")
      credentials.push(credencial);
    }
    for (let index = 0; index < keyoauth.length; index++) {
      let credencial = new CredentialOauth(keyoauth[index].id, keyoauth[index].key, keyoauth[index].client_id, keyoauth[index].client_secret, 'oauth2')
      credentials.push(credencial);
    }
    console.log(credentials)
    return credentials;
  }


  public async listCredential(idConsumer: string) {
    const url = `${await this.getUrl()}/consumers/${idConsumer}/key-auth`
    const response = await axios.get(url);
    const list = response.data;
    const credentials: Credential[] = []
    for (let index = 0; index < list.length; index++) {
      let credencial = new Credential(list[index].id, list[index].key, "teste")
      credentials.push(credencial);
    }
    return credentials;
  }

  public async removeCredencial(options: RouterOptions, idApplication: string, idCredencial: string) {
    const applicationRepository = await PostgresApplicationRepository.create(
      await options.database.getClient(),
    );
    const application: Application = await applicationRepository.getApplicationById(idApplication) as Application
    const url = `${await this.getUrl()}/consumers/${application.externalId}/key-auth/${idCredencial}`

    const response = await axios.delete(url);
    return response.data;
  }

  public async deletePluginsService(
    serviceName: string,
    pluginId: string,
  ): Promise<Service[]> {
    const url = `${await this.getUrl()}/services/${serviceName}/plugins/${pluginId}`;
    const response = await axios.delete(url);
    const servicesStore = response.data;
    return servicesStore;
  }
}
