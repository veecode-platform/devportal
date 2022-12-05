import axios from 'axios';
import { Consumer } from '../model/Consumer';

export class ConsumerService {
  public async listConsumerByName(
    tls: false,
    kongUrl: string,
    consumerName: string,
  ): Promise<Consumer> {
    const url = tls
      ? `https://${kongUrl}/consumers/${consumerName}`
      : `http://${kongUrl}/consumers/${consumerName}`;
    const response = await axios.get(url);
    const consumer = response.data;
    return consumer;
  }

  public async deleteConsumerById(
    tls: false,
    kongUrl: string,
    consumerId: string,
  ): Promise<Consumer> {
    const url = tls
      ? `https://${kongUrl}/consumers/${consumerId}`
      : `http://${kongUrl}/consumers/${consumerId}`;
    const response = await axios.delete(url);
    const consumer = response.data;
    return consumer;
  }

  public async createConsumer(
    tls: false,
    kongUrl: string,
    consumer: Consumer,
  ): Promise<Consumer> {
    const url = tls
      ? `https://${kongUrl}/consumers`
      : `http://${kongUrl}/consumers`;
    const response = await axios.post(url, consumer);
    return response.data.consumer;
  }

  public async updateConsumer(
    tls: false,
    kongUrl: string,
    consumerId: string,
    consumer: Consumer,
  ): Promise<Consumer> {
    const url = tls
      ? `https://${kongUrl}/consumers/${consumerId}`
      : `http://${kongUrl}/consumers/${consumerId}`;
    const response = await axios.put(url, consumer);
    return response.data.consumer;
  }
}
