// class to access kong api manager service
import axios from 'axios'

type Service = {
  name: string;
  id: string;
}
export class KongHandler {
  
  public async listServices(): Promise<Service[]> {
    //const url = tls ? `https://${kongUrl}/services` : `http://${kongUrl}/services`;
    const url = "https://kong-kong-admin-kong-luangazin.cloud.okteto.net/services"
    /*const config = {
    }*/
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    //console.log("here:", servicesStore);
    return response ? servicesStore.map((service:Service)=> {return{"name":service.name, "id":service.id}}) : [];
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


  
}    