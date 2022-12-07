import axios from 'axios';
import { Consumer } from '../model/Consumer';
import { kongHeaders } from '../../utils/KongHeaders';
import { KongConsumerBase } from '../model/KongConsumerBase';

export class ConsumerService extends KongConsumerBase {
  public async findConsumer(consumerName: string) {
    const url = `${this._kongUrl}/consumers/${consumerName}`;
    const response = await axios.get(url, {
      headers: kongHeaders(this._kongAdminToken),
    });
    const consumer = response.data;
    return consumer;
  }

  public async deleteConsumer(consumerId: string): Promise<Consumer> {
    const url = `${this._kongUrl}/consumers/${consumerId}`;
    const response = await axios.delete(url, {
      headers: kongHeaders(this._kongAdminToken),
    });
    const consumer = response.data;
    return consumer;
  }

  public async createConsumer(consumer: Consumer): Promise<Consumer> {
    const url = `${this._kongUrl}/consumers`;
    const response = await axios.post(url, consumer, {
      headers: kongHeaders(this._kongAdminToken),
    });
    return response.data.consumer;
  }

  public async updateConsumer(
    consumerId: string,
    consumer: Consumer,
  ): Promise<Consumer> {
    const url = `${this._kongUrl}/consumers/${consumerId}`;
    const response = await axios.put(url, consumer, {
      headers: kongHeaders(this._kongAdminToken),
    });
    return response.data.consumer;
  }
}
