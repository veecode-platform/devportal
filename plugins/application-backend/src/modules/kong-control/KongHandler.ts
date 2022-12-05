// class to access kong api manager service
import axios from 'axios';
import { Consumer } from "./model/Consumer";

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

  // consumers
  public async listConsumerByName(tls: false, kongUrl: string, consumerName: string): Promise<Consumer> {
    const url = tls ? `https://${kongUrl}/consumers/${consumerName}` : `http://${kongUrl}/consumers/${consumerName}`;
    const response = await axios.get(url);
    const consumer = response.data;
    return consumer;
  }

  public async deleteConsumerById(tls: false, kongUrl: string, consumerId: string): Promise<Consumer> {
    const url = tls ? `https://${kongUrl}/consumers/${consumerId}` : `http://${kongUrl}/consumers/${consumerId}`;
    const response = await axios.delete(url);
    const consumer = response.data;
    return consumer;
  }

  public async createConsumer(tls: false, kongUrl: string, consumer: Consumer): Promise<Consumer> {
    const url = tls ? `https://${kongUrl}/consumers` : `http://${kongUrl}/consumers`;
    const response = await axios.post(url, consumer);
    return response.data.consumer;
  }

  public async updateConsumer(tls: false, kongUrl: string, consumerId: string, consumer: Consumer): Promise<Consumer> {
    const url = tls ? `https://${kongUrl}/consumers/${consumerId}` : `http://${kongUrl}/consumers/${consumerId}`;
    const response = await axios.put(url, consumer);
    return response.data.consumer;
  }
}    
