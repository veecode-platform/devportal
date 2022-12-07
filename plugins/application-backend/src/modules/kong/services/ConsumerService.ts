import axios from 'axios';
import { Consumer } from '../model/Consumer';
import { kongHeaders } from '../../utils/KongHeaders';

export class ConsumerService {
  public async findConsumerByName(
    tls: false,
    kongUrl: string,
    consumerName: string,
    kongAdminToken: string,
  ) {
    const url = tls
      ? `https://${kongUrl}/consumers/${consumerName}`
      : `http://${kongUrl}/consumers/${consumerName}`;
    const response = await axios.get(url, {
      headers: kongHeaders(kongAdminToken),
    });
    const consumer = response.data;
    return consumer;
  }

  public async deleteConsumerById(
    tls: false,
    kongUrl: string,
    consumerId: string,
    kongAdminToken: string,
  ): Promise<Consumer> {
    const url = tls
      ? `https://${kongUrl}/consumers/${consumerId}`
      : `http://${kongUrl}/consumers/${consumerId}`;
    const response = await axios.delete(url, {
      headers: kongHeaders(kongAdminToken),
    });
    const consumer = response.data;
    return consumer;
  }

  public async createConsumer(
    tls: false,
    kongUrl: string,
    consumer: Consumer,
    kongAdminToken: string,
  ): Promise<Consumer> {
    const url = tls
      ? `https://${kongUrl}/consumers`
      : `http://${kongUrl}/consumers`;
    const response = await axios.post(url, consumer, {
      headers: kongHeaders(kongAdminToken),
    });
    return response.data.consumer;
  }

  public async updateConsumer(
    tls: false,
    kongUrl: string,
    consumerId: string,
    consumer: Consumer,
    kongAdminToken: string,
  ): Promise<Consumer> {
    const url = tls
      ? `https://${kongUrl}/consumers/${consumerId}`
      : `http://${kongUrl}/consumers/${consumerId}`;
    const response = await axios.put(url, consumer, {
      headers: kongHeaders(kongAdminToken),
    });
    return response.data.consumer;
  }
}
