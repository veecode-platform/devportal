import { RouterOptions } from '../../../service/router';
import { Application } from '../../applications/domain/Application';
import { ApplicationDto } from '../../applications/dtos/ApplicationDto';
import { PostgresApplicationRepository } from '../../applications/repositories/knex/KnexApplicationRepository';
import { ApplicationServices } from '../../applications/services/ApplicationServices';
import { UserDto } from '../../keycloak/dtos/UserDto';
import { KeycloakUserService } from '../../keycloak/service/UserService';
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
    partner: PartnerDto,
    options: RouterOptions,
  ) {
    try {
      const partnerRepository = await PostgresPartnerRepository.create(
        await options.database.getClient(),
      );
      const applicationRepository = await PostgresApplicationRepository.create(
        await options.database.getClient(),
      );
      const parnterInstance = await partnerRepository.getPartnerById(partnerId);

      if (parnterInstance instanceof Object) {
        const applications: string[] = partner.applicationId as string[];
        applications.forEach(async id => {
          const applicationInstance =
            (await applicationRepository.getApplicationById(id)) as Application;
          const applicationDto = new ApplicationDto(
            applicationInstance.name as string,
            applicationInstance.creator as string,
            applicationInstance.parternId as string,
            applicationInstance.servicesId as string[],
          );
          ApplicationServices.Instance.updateApplication(
            id,
            applicationDto,
            options,
          );
        });

        const listUsers = await KeycloakUserService.Instance.listUsers();
        const keycloakUser = listUsers.find(x => x.email === partner.email);

        if (typeof keycloakUser?.id === 'string') {
          const userDto = new UserDto(partner.name, partner.email);
          await KeycloakUserService.Instance.updateUser(
            keycloakUser.id,
            userDto,
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
