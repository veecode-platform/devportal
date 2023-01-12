import { RouterOptions } from '../../../service/router';
import { Consumer } from '../../kong/model/Consumer';
import { ConsumerGroupService } from '../../kong/services/ConsumerGroupService';
import { ConsumerService } from '../../kong/services/ConsumerService';
import { Service } from '../../services/domain/Service';
import { PostgresServiceRepository } from '../../services/repositories/Knex/KnexServiceReppository';
import {
  appDtoNameConcatParternId,
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
      const consumer = new Consumer(appDtoNameConcatParternId(application));
      const servicesId: string[] = application.servicesId;
      const serviceRepository = await PostgresServiceRepository.create(
        await options.database.getClient(),
      );

      await ConsumerService.Instance.createConsumer(consumer);
      servicesId.forEach(async x => {
        const service: Service = await serviceRepository.getServiceById(x);
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
        ConsumerService.Instance.deleteConsumer(application.name as string);
      }
      applicationRepository.deleteApplication(applicationId);
    } catch (error) {
      console.log(error);
    }
  }

  public async updateApplication(
    applicationId: string,
    applicationDto: ApplicationDto,
    options: RouterOptions,
  ) {
    try {
      const serviceRepository = await PostgresServiceRepository.create(
        await options.database.getClient(),
      );
      const applicationRepository = await PostgresApplicationRepository.create(
        await options.database.getClient(),
      );
      const application = await applicationRepository.getApplicationById(
        applicationId,
      );
      const servicesId: string[] = applicationDto.servicesId;

      if (application instanceof Object) {
        await ConsumerGroupService.Instance.removeConsumerFromGroups(
          application.name as string,
        );

        servicesId.forEach(async x => {
          const service = await serviceRepository.getServiceById(x);
          if (service instanceof Object) {
            ConsumerGroupService.Instance.addConsumerToGroup(
              serviceConcatGroup(service.name as string),
              application.name as string,
            );
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
