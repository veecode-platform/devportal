// class to access kong api manager service
import { PluginDatabaseManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import axios from 'axios'
import { Logger } from 'winston';
import { Application, ApplicationProps } from '../applications/domain/Application';
import { PostgresApplicationRepository } from '../applications/repositories/knex/KnexApplicationRepository';
import { credential } from './Credential';


type Service = {
  name: string;
}

export type DataBaseOptions = {
  database: PluginDatabaseManager;
}
export class KongHandler {
  


  
  public async listServices(kongUrl:string,tls?:false): Promise<Service[]> {
    const url = tls ? `https://${kongUrl}/services` : `http://${kongUrl}/services`;
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response ? servicesStore.map((service:Service)=> service.name) : [];

    
  }

  public async applyPluginToRoute(tls:false,kongUrl:string): Promise<Service[]> {
    const url = tls ? `https://${kongUrl}/services` : `http://${kongUrl}/services`;
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response ? servicesStore.map((service:Service)=> service.name) : [];
  }
  
  public async listPlugins(tls:false,kongUrl:string): Promise<Service[]> {
    const url = tls ? `https://${kongUrl}/services` : `http://${kongUrl}/services`;
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response ? servicesStore.map((service:Service)=> service.name) : [];
  }

  public async listRoutes(tls:false,kongUrl:string): Promise<Service[]> {
    const url = tls ? `https://${kongUrl}/services` : `http://${kongUrl}/services`;
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response ? servicesStore.map((service:Service)=> service.name) : [];
  }

  public async listConsumers(tls:false,kongUrl:string): Promise<Service[]> {
    const url = tls ? `https://${kongUrl}/services` : `http://${kongUrl}/services`;
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response ? servicesStore.map((service:Service)=> service.name) : [];
  }

  public async generateCredential(tls:boolean, kongUrl: string, workspace: string, idConsumer: string){
    const url = tls ? `https://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth` : `http://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth`
    const response = await axios.post(url);
    return response.data;
  }


  async listCredentialWithApplication(dataBaseOptions: PluginDatabaseManager, id: string, workspace: string, kongUrl: string, tls: boolean) {
    const applicationRepository = await PostgresApplicationRepository.create(
      await dataBaseOptions.getClient(),    
    );

    const application:ApplicationProps = await applicationRepository.getApplicationById(id);
    console.log('application', application)  
 
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


  public async listCredential(tls:boolean, kongUrl: string, workspace: string, idConsumer: string){
    



    const url = tls ? `https://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth` : `http://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth`
    console.log("AQUI ", url)
    const response = await axios.get(url);
    const list = response.data.data;
    const credentials: credential[] = []
    for (let index = 0; index < list.length; index++) {
      let credencial = new credential(list[index].id, list[index].key)
      credentials.push(credencial);
 
       
    }

    console.log(credentials)
    return credentials;
  }

  public async removeCredencial(tls: boolean, kongUrl: string, workspace: string, idConsumer: string, idCredencial: string){
    const url = tls ? `https://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth/${idCredencial}` : `http://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth/${idCredencial}`
    
    const response = await axios.delete(url);
    return response.data;
  }

  
}    
