import { KeycloakAdminClient } from '../adminClient';
import { UserDto } from '../dtos/UserDto';

export class KeycloakUserService {
  private static _instance: KeycloakUserService;

  public constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async createUser(user: UserDto) {
    const kcAdminClient = await new KeycloakAdminClient().getClient();
    const user_id = await kcAdminClient.users.create(user);
    return user_id;
  }

  public async listUsers() {
    const kcAdminClient = await new KeycloakAdminClient().getClient();
    const users = await kcAdminClient.users.find();
    return users;
  }

  public async findUser(id: string) {
    const kcAdminClient = await new KeycloakAdminClient().getClient();
    const user = await kcAdminClient.users.findOne({
      id: id,
    });
    return user;
  }

  public async updateUser(id: string, user: UserDto) {
    const kcAdminClient = await new KeycloakAdminClient().getClient();
    const updated = await kcAdminClient.users.update({ id: id }, user);
    return updated;
  }

  public async deleteUser(id: string) {
    const kcAdminClient = await new KeycloakAdminClient().getClient();
    const deleted = await kcAdminClient.users.del({ id: id });
    return deleted;
  }

  public async listUserGroups(id: string) {
    const kcAdminClient = await new KeycloakAdminClient().getClient();
    const result = await kcAdminClient.users.listGroups({
      id: id,
    });
    return result;
  }

  public async addUserToGroup(id: string, groupId: string) {
    const kcAdminClient = await new KeycloakAdminClient().getClient();
    const result = await kcAdminClient.users.addToGroup({
      id: id,
      groupId: groupId,
    });
    return result;
  }

  public async removeUserFromGroup(id: string, groupId: string) {
    const kcAdminClient = await new KeycloakAdminClient().getClient();
    const result = await kcAdminClient.users.delFromGroup({
      id: id,
      groupId: groupId,
    });
    return result;
  }
}
