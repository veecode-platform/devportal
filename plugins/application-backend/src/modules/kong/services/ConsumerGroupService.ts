import axios from 'axios';
import { kongConsumerGroupExceptions } from '../exceptions/consumerGroup/KongConsumerGroupException';
import { ConsumerGroup } from '../model/ConsumerGroup';
import { KongServiceBase } from './KongServiceBase';

export class ConsumerGroupService extends KongServiceBase {

    public async createConsumerGroup(consumerGroup: ConsumerGroup): Promise<ConsumerGroup> {
        const url = `${this.baseUrl}/consumer_groups`;
        const response = await axios
            .post(url, consumerGroup, {
                headers: this.getAuthHeader(),
            })
            .catch(kongConsumerGroupExceptions);
        return response.data.consumerGroup;
    }

    public async listConsumerGroups(): Promise<ConsumerGroup[]> {
        const url = `${this.baseUrl}/consumer_groups`;
        const response = await axios
            .get(url, {
                headers: this.getAuthHeader(),
            })
            .catch(kongConsumerGroupExceptions);
        const groups = response.data.data;
        return groups.map((group:ConsumerGroup) => group);
    }
    
    public async deleteConsumerGroup(consumerGroupId: string): Promise<ConsumerGroup> {
        const url = `${this.baseUrl}/consumer_groups/${consumerGroupId}`;
        const response = await axios
          .delete(url, {
            headers: this.getAuthHeader(),
          })
          .catch(kongConsumerGroupExceptions);
        const consumerGroup = response.data;
        return consumerGroup;
    }

    public async addConsumerToGroup(consumerGroupId:string, consumerId:string) {
        const url = `${this.baseUrl}/consumer_groups/${consumerGroupId}/consumers`;
        const response = await axios
            .post(url, consumerId, {
                headers: this.getAuthHeader(),
            })
            .catch(kongConsumerGroupExceptions);
        return response.data;
    }

    public async removeConsumerFromGroups(consumerId:string){
        const url = `${this.baseUrl}/consumers/${consumerId}/consumer_groups`;
        const response = await axios
          .delete(url, {
            headers: this.getAuthHeader(),
          })
          .catch(kongConsumerGroupExceptions);

        const consumerGroup = response.data;
        return consumerGroup;
    }

    public async removeConsumerFromGroup(consumerId:string, consumerGroupId:string){
        // Remove a consumer from a consumer group

        const url = `${this.baseUrl}/consumers/${consumerId}/consumer_groups/${consumerGroupId}`;
        const response = await axios
          .delete(url, {
            headers: this.getAuthHeader(),
          })
          .catch(kongConsumerGroupExceptions);

        const consumerGroup = response.data;
        return consumerGroup;
    }
}