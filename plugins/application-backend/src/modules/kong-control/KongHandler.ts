// class to access kong api manager service
import axios from 'axios'
import { credential } from './Credential';

type Service = {
  name: string;
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


  public async listCredential(tls:boolean, kongUrl: string, workspace: string, idConsumer: string){
    console.log("aquiiiiia")
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
