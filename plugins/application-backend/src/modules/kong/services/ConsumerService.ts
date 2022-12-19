import axios from 'axios';
import { kongConsumerExceptions } from '../exceptions/consumer/KongConsumerException';
import { Consumer } from '../model/Consumer';
import { KongServiceBase } from './KongServiceBase';

export class ConsumerService extends KongServiceBase {
  public async findConsumer(consumerName: string) {
    const url = `${this.baseUrl}/consumers/${consumerName}`;
    const response = await axios
      .get(url, {
        headers: this.getAuthHeader(),
      })
      .catch(kongConsumerExceptions);

    return response.data;
  }

  public async deleteConsumer(consumerId: string): Promise<Consumer> {
    const url = `${this.baseUrl}/consumers/${consumerId}`;
    const response = await axios
      .delete(url, {
        headers: this.getAuthHeader(),
      })
      .catch(kongConsumerExceptions);
    const consumer = response.data;
    return consumer;
  }

  public async createConsumer(consumer: Consumer): Promise<Consumer> {
    const url = `${this.baseUrl}/consumers`;
    const response = await axios
      .post(url, consumer, {
        headers: this.getAuthHeader(),
      })
      .catch(kongConsumerExceptions);
    return response.data.consumer;
  }

  public async updateConsumer(
    consumerId: string,
    consumer: Consumer,
  ): Promise<Consumer> {
    const url = `${this.baseUrl}/consumers/${consumerId}`;
    const response = await axios
      .put(url, consumer, {
        headers: this.getAuthHeader(),
      })
      .catch(kongConsumerExceptions);
    return response.data.consumer;
  }
}
