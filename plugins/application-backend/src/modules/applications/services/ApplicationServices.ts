import { RouterOptions } from '../../../service/router';
import { Consumer } from '../../kong/model/Consumer';
import { ConsumerGroupService } from '../../kong/services/ConsumerGroupService';
import { ConsumerService } from '../../kong/services/ConsumerService';
import { PostgresServiceRepository } from '../../services/repositories/Knex/KnexServiceReppository';
import {
  appNameConcatParternId,
  serviceConcatGroup,
} from '../../utils/ConcatUtil';
import { ApplicationDto } from '../dtos/ApplicationDto';
import { PostgresApplicationRepository } from '../repositories/knex/KnexApplicationRepository';

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
      const consumer = new Consumer(appNameConcatParternId(application));
      const servicesId: string[] = application.servicesId;
      const serviceRepository = await PostgresServiceRepository.create(
        await options.database.getClient(),
      );

      ConsumerService.Instance.createConsumer(consumer);
      servicesId.forEach(async x => {
        const service = await serviceRepository.getServiceById(x);
        if (service instanceof Object) {
          ConsumerGroupService.Instance.addConsumerToGroup(
            serviceConcatGroup(service.name as string),
            consumer.username,
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async removeApplication(
    applicationId: string,
    options: RouterOptions,
  ) {
    try {
      const applicationRepository = await PostgresApplicationRepository.create(
        await options.database.getClient(),
      );
      const application = await applicationRepository.getApplicationById(
        applicationId,
      );
      if (application instanceof Object) {
        ConsumerGroupService.Instance.removeConsumerFromGroups(
          application.name as string,
        );
      }
      applicationRepository.deleteApplication(applicationId);
    } catch (error) {
      console.log(error);
    }
  }
}