import { RouterOptions } from '../../../service/router';
import { ApplicationDto } from '../../applications/dtos/ApplicationDto';
import { PostgresApplicationRepository } from '../../applications/repositories/knex/KnexApplicationRepository';
import { ApplicationServices } from '../../applications/services/ApplicationServices';
import { UserDto } from '../../keycloak/dtos/UserDto';
import { KeycloakUserService } from '../../keycloak/service/UserService';
import { ServiceDto } from '../../services/dtos/ServiceDto';
import { PostgresServiceRepository } from '../../services/repositories/Knex/KnexServiceReppository';
import { ControllPlugin } from '../../services/service/ControllPlugin';
import { PartnerDto } from '../dtos/PartnerDto';
import { PostgresPartnerRepository } from '../repositories/Knex/KnexPartnerReppository';

export class PartnerServices {
  private static _instance: PartnerServices;

  public constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async createPartner(partner: PartnerDto, groupId: string) {
    try {
      const user = new UserDto(partner.name, partner.email);
      const keycloakUser = await KeycloakUserService.Instance.createUser(user);
      await KeycloakUserService.Instance.addUserToGroup(
        keycloakUser.id,
        groupId,
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async removePartner(partnerId: string, options: RouterOptions) {
    try {
      const partnerRepository = await PostgresPartnerRepository.create(
        await options.database.getClient(),
      );
      const partner = await partnerRepository.getPartnerById(partnerId);

      if (partner instanceof Object) {
        const applications: string[] = partner.applicationId as string[];
        applications.forEach(application => {
          ApplicationServices.Instance.removeApplication(application, options);
        });

        const services: string[] = partner.servicesId as string[];
        services.forEach(service => {
          ControllPlugin.Instance.removePlugin(options, service);
        });

        const listUsers = await KeycloakUserService.Instance.listUsers();
        const keycloakUser = listUsers.find(x => x.email === partner.email);

        if (typeof keycloakUser?.id === 'string') {
          await KeycloakUserService.Instance.deleteUser(keycloakUser.id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async updatePartner(
    partnerId: string,
    partnerDto: PartnerDto,
    options: RouterOptions,
  ) {
    try {
      const partnerRepository = await PostgresPartnerRepository.create(
        await options.database.getClient(),
      );
      const applicationRepository = await PostgresApplicationRepository.create(
        await options.database.getClient(),
      );
      const serviceRepository = await PostgresServiceRepository.create(
        await options.database.getClient(),
      );
      const partner = await partnerRepository.getPartnerById(partnerId);

      if (partner instanceof Object) {
        const listUsers = await KeycloakUserService.Instance.listUsers();
        const keycloakUser = listUsers.find(x => x.email === partner.email);

        if (typeof keycloakUser?.id === 'string') {
          const userDto = new UserDto(
            partnerDto.name as string,
            partnerDto.email as string,
          );
          await KeycloakUserService.Instance.updateUser(
            keycloakUser.id,
            userDto,
          );
        }

        if (partnerDto.active === false) {
          const applications = partnerDto.applicationId as string[];
          applications.forEach(async application => {
            const applicationObj =
              await applicationRepository.getApplicationById(application);
            if (applicationObj instanceof Object) {
              let applicationDto = new ApplicationDto(
                applicationObj.name as string,
                applicationObj.creator as string,
                applicationObj.parternId as string,
                applicationObj.servicesId as string[],
                (applicationObj.active = false),
              );
              await applicationRepository.patchApplication(
                application,
                applicationDto,
              );
            }
          });
        }

        if (partnerDto.active === false) {
          const services = partnerDto.servicesId as string[];
          services.forEach(async service => {
            const serviceObj = await serviceRepository.getServiceById(service);
            if (serviceObj instanceof Object) {
              let serviceDto = new ServiceDto(
                serviceObj.name as string,
                serviceObj.description as string,
                serviceObj.partnersId as string[],
                serviceObj.redirectUrl as string,
                serviceObj.kongServiceName as string,
                serviceObj.kongServiceId as string,
                (serviceObj.active = false),
              );
              await serviceRepository.patchService(service, serviceDto);
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
