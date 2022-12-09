import axios from 'axios';
import { kongHeaders } from '../../utils/KongHeaders';
import { ConsumerGroup } from '../model/ConsumerGroup';
import { KongServiceBase } from './KongServiceBase';

export class ConsumerGroupService extends KongServiceBase {

    public async createConsumerGroup(consumerGroup: ConsumerGroup): Promise<ConsumerGroup> {
        const url = `${this.url}/consumer_groups`;
        const response = await axios
            .post(url, consumerGroup, {
                headers: kongHeaders(this.adminToken),
            })
        return response.data.consumerGroup;
    }
    
    public async deleteConsumerGroup(consumerGroupId: string): Promise<ConsumerGroup> {
        const url = `${this.url}/consumer_groups/${consumerGroupId}`;
        const response = await axios
          .delete(url, {
            headers: kongHeaders(this.adminToken),
          })
        const consumerGroup = response.data;
        return consumerGroup;
      }


}