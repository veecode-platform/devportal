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

      const serviceRepository = await PostgresServiceRepository.create(
        await options.database.getClient(),
      );

      const servicesId: string[] = application.servicesId;

      servicesId.forEach(async x => {
        try {
          const service = await serviceRepository.getServiceById(x);
          if (service instanceof Object) {
            ConsumerGroupService.Instance.addConsumerToGroup(
              service.name + '-group',
              consumer.username,
            );
          }
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}
