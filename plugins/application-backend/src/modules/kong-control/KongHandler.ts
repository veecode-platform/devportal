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


  // PLUGINS
  public async applyPluginToRoute(tls:false,kongUrl:string): Promise<Service[]> {
    const url = tls ? `https://${kongUrl}/services` : `http://${kongUrl}/services`;
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response ? servicesStore.map((service:Service)=> service.name) : [];
  }

  public async applyPluginToService(tls:false,kongUrl:string, serviceName: string, pluginName: string): Promise<Service[]> {
    const url = tls ? `https://${kongUrl}/services/${serviceName}/plugins` : `http://${kongUrl}/services/${serviceName}/plugins`;
    console.log('antes da request')
    const response = await axios.post(url, 
    {
        name: `${pluginName}`
      }
    , {
      headers:{
        'Content-Type': 'application/json'
      }
    } );
    const servicesStore = response.data
    return servicesStore;
  }
  public async updatePluginService(tls:false,kongUrl:string, serviceName: string, pluginName: string): Promise<Service[]> {
    const url = tls ? `https://${kongUrl}/services/${serviceName}/plugins` : `http://${kongUrl}/services/${serviceName}/plugins`;
    console.log('antes da request')
    const response = await axios.post(url, 
    {
        name: `${pluginName}`
      }
    , {
      headers:{
        'Content-Type': 'application/json'
      }
    } );
    const servicesStore = response.data
    return servicesStore;
  }
  
  
  public async listPluginsService(tls:false,kongUrl:string, serviceName: string): Promise<Service[]> {
    const url = tls ? `https://${kongUrl}/services/${serviceName}/plugins` : `http://${kongUrl}/services/${serviceName}/plugins`;
    const response = await axios.get(url);
    const servicesStore = response.data.data;
    return response ? servicesStore.map((service:Service)=> service.name) : [];
  }
  
}    