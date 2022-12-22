import axios from 'axios';
import { kongConsumerGroupExceptions } from '../exceptions/consumerGroup/KongConsumerGroupException';
import { ConsumerGroup } from '../model/ConsumerGroup';
import { KongServiceBase } from './KongServiceBase';

export class ConsumerGroupService extends KongServiceBase {

    public async createConsumerGroup(consumerGroup: ConsumerGroup): Promise<ConsumerGroup> {
        const url = `${await this.getBaseUrl()}/consumer_groups`;
        const response = await axios
            .post(url, {
                name: consumerGroup.name
            },
                {
                headers: await this.getAuthHeader(),
            })
            .catch(kongConsumerGroupExceptions);
        return response.data
    }

    public async listConsumerGroups(): Promise<ConsumerGroup[]> {
        const url = `${await this.getBaseUrl()}/consumer_groups`;
        const response = await axios
            .get(url, {
                headers: await this.getAuthHeader(),
            })
            .catch(kongConsumerGroupExceptions);
        const groups = response.data.data;
        return groups.map((group:ConsumerGroup) => group);
    }
    
    public async deleteConsumerGroup(consumerGroupId: string): Promise<ConsumerGroup> {
        const url = `${await this.getBaseUrl()}/consumer_groups/${consumerGroupId}`;
        const response = await axios
          .delete(url, {
            headers: await this.getAuthHeader(),
          })
          .catch(kongConsumerGroupExceptions);
        const consumerGroup = response.data;
        return consumerGroup;
    }

    public async addConsumerToGroup(consumerGroupId:string, consumerId: ConsumerGroup) {
        const url = `${await this.getBaseUrl()}/consumer_groups/${consumerGroupId}/consumers`;
        const response = await axios
            .post(url, consumerId, {
                headers: await this.getAuthHeader(),
            })
            .catch(kongConsumerGroupExceptions);
        return response.data;
    }

    public async removeConsumerFromGroups(consumerId:string){
        const url = `${await this.getBaseUrl()}/consumers/${consumerId}/consumer_groups`;
        const response = await axios
          .delete(url, {
            headers: await this.getAuthHeader(),
          })
          .catch(kongConsumerGroupExceptions);

        const consumerGroup = response.data;
        return consumerGroup;
    }

    public async removeConsumerFromGroup(consumerId:string, consumerGroupId:string){
        // Remove a consumer from a consumer group

        const url = `${await this.getBaseUrl()}/consumers/${consumerId}/consumer_groups/${consumerGroupId}`;
        const response = await axios
          .delete(url, {
            headers: await this.getAuthHeader(),
          })
          .catch(kongConsumerGroupExceptions);

        const consumerGroup = response.data;
        return consumerGroup;
    }
}