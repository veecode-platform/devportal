import axios from 'axios';
import { Consumer } from '../model/Consumer';
import { kongHeaders } from '../../utils/KongHeaders';
import { Config } from '@backstage/config';

export class ConsumerService {
  private _kongUrl: string;
  private _kongAdminToken;

  constructor(private _config: Config) {
    this._kongUrl = _config.getString('kong.api-manager');
    this._kongAdminToken = this._config.getString('kong.admin-token');
  }

  public async findConsumerByName(consumerName: string) {
    const url = `${this._kongUrl}/consumers/${consumerName}`;
    const response = await axios.get(url, {
      headers: kongHeaders(this._kongAdminToken),
    });
    const consumer = response.data;
    return consumer;
  }

  public async deleteConsumerById(consumerId: string): Promise<Consumer> {
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
