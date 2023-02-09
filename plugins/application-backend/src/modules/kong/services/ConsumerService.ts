import axios from 'axios';
import { kongConsumerExceptions } from '../exceptions/consumer/KongConsumerException';
import { Consumer } from '../model/Consumer';
import { KongServiceBase } from './KongServiceBase';

export class ConsumerService extends KongServiceBase {
  private static _instance: ConsumerService;

  public constructor() {
    super();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async findConsumer(consumerName: string) {
    const url = `${await this.getBaseUrl()}/consumers/${consumerName}`;
    const response = await axios
      .get(url, {
        headers: await this.getAuthHeader(),
      })
      .catch(kongConsumerExceptions);

    return response.data;
  }

  public async deleteConsumer(consumerId: string): Promise<Consumer> {
    const url = `${await this.getBaseUrl()}/consumers/${consumerId}`;
    const response = await axios
      .delete(url, {
        headers: await this.getAuthHeader(),
      })
      .catch(kongConsumerExceptions);
    const consumer = response.data;
    return consumer;
  }

  public async createConsumer(consumer: Consumer): Promise<Consumer> {
    const url = `${await this.getBaseUrl()}/consumers`;
    console.log('url', url)
    const response = await axios
      .post(url, consumer, {
        headers: await this.getAuthHeader(),
      })
      .catch(kongConsumerExceptions);
    return response.data.consumer;
  }

  public async updateConsumer(
    consumerId: string,
    consumer: Consumer,
  ): Promise<Consumer> {
    const url = `${await this.getBaseUrl()}/consumers/${consumerId}`;
    const response = await axios
      .put(url, consumer, {
        headers: await this.getAuthHeader(),
      })
      .catch(kongConsumerExceptions);
    return response.data.consumer;
  }
}
