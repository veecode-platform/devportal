import { Consumer } from '../../kong/model/Consumer';
import { ConsumerService } from '../../kong/services/ConsumerService';
import { Application } from '../domain/Application';

export class ApplicationServices {
  public constructor() {}

  public createApplication(application: Application) {
    const consumer = new Consumer(application.props.name);
    const consumerService = ConsumerService.Instance.createConsumer(consumer);
  }
}
