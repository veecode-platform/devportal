import { PartnerDto } from '../dtos/PartnerDto';
import { RouterOptions } from '../../../service/router';
import { KeycloakUserService } from '../../keycloak/service/UserService';
import { UserDto } from '../../keycloak/dtos/UserDto';

export class PartnerServices {
  private static _instance: PartnerServices;

  public constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async createPartner(partner: PartnerDto, options: RouterOptions) {
    try {
      const user = new UserDto(partner.name, partner.email);
      await KeycloakUserService.Instance.createUser(user);
    } catch (error) {
      console.log(error);
    }
  }
}
