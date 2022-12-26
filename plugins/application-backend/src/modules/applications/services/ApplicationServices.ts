import { RouterOptions } from '../../../service/router';
import { Consumer } from '../../kong/model/Consumer';
import { ConsumerGroupService } from '../../kong/services/ConsumerGroupService';
import { ConsumerService } from '../../kong/services/ConsumerService';
import { PostgresServiceRepository } from '../../services/repositories/Knex/KnexServiceReppository';
import { ApplicationDto } from '../dtos/ApplicationDto';

export class ApplicationServices {
  private static _instance: ApplicationServices;

  public constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async createApplication(
    application: ApplicationDto,
    options: RouterOptions,
  ) {
    try {
      const consumer = new Consumer(application.name);
      ConsumerService.Instance.createConsumer(consumer);
      let serviceNames: string[] = [];

      const serviceRepository = await PostgresServiceRepository.create(
        await options.database.getClient(),
      );

      const servicesId: string[] = application.servicesId;

      servicesId.forEach(x => {
        const service = serviceRepository.getServiceById(x);
        service
          .then(result => {
            if (result instanceof Object) {
              serviceNames.push(result.props.name + '-group');
            }
          })
          .catch(error => {
            throw new Error(error);
          });
      });

      serviceNames.forEach(consumerGroupName => {
        ConsumerGroupService.Instance.addConsumerToGroup(
          consumerGroupName,
          consumer.username,
        );
      });
    } catch (error) {
      console.log(error);
    }
  }
}
