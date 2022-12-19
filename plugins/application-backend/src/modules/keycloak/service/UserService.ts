import { KeycloakAdminClient } from "../adminClient";
import { User } from "../domain/User";
const kcAdminClient = await new KeycloakAdminClient().getClient();

export class KeycloakUserService {
    
    public async createUser() {
        const kcAdminClient = await new KeycloakAdminClient().getClient();
        const user = await kcAdminClient.users.create(); 
        return user
    }

    public async listAll() {
        const kcAdminClient = await new KeycloakAdminClient().getClient();
        const users = await kcAdminClient.users.find();
        return users
    }
    
    public async updateUser(user:User){
        const updated = await kcAdminClient.users.update({
            id: user.id,
            realm: realm},
            user,
        );
        return updated
    }

    public async deleteUser(){
        const delUser = await kcAdminClient.users.del();
        return delUser
    }

    public async addUserToGroup(group:Group, user:User){
        const result = await kcAdminClient.users.addToGroup({
            groupId: group.id,
            id: user.id
        })
        return result
    }

    public async removeUserFromGroup(group:Group, user:User){
        const result = await kcAdminClient.users.delFromGroup({
            groupId: group.id,
            id: user.id
        })
        return result

    }   
}