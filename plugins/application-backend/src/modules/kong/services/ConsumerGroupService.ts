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
}