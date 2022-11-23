// class to access kong api manager service
import axios from 'axios'

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

  public async generateCredential(tls:false, kongUrl: string, workspace: string, idConsumer: string){
    const url = tls ? `https://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth` : `http://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth`
    const response = await axios.post(url);
    return response.data;
  }


  public async listCredential(tls:false, kongUrl: string, workspace: string, idConsumer: string){
    const url = tls ? `https://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth` : `http://${kongUrl}/${workspace}/consumers/${idConsumer}/key-auth`
    const response = await axios.get(url);
    const list = response.data.data;
    const keys = []
    for (let index = 0; index < list.length; index++) {
       keys.push(list[index].key);
    }

    console.log(keys)
    return keys;
  }

  
}    