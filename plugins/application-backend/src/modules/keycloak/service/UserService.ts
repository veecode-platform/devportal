import { KeycloakAdminClient } from "../adminClient";
import { UpdateUserDto, UserDto } from "../dtos/UserDto";
// import { User } from "../domain/User";
// const kcAdminClient = await new KeycloakAdminClient().getClient();

export class KeycloakUserService {
    
    public async createUser(user:UserDto) {
        const kcAdminClient = await new KeycloakAdminClient().getClient();
        const user_id = await kcAdminClient.users.create(user); 
        return user_id
    }

    public async listUsers() {
        const kcAdminClient = await new KeycloakAdminClient().getClient();
        const users = await kcAdminClient.users.find();
        return users
    }
    
    public async updateUser(id:string, user:UpdateUserDto){
        const kcAdminClient = await new KeycloakAdminClient().getClient();
        const updated = await kcAdminClient.users.update({id: id},user);
        return updated
    }

    public async deleteUser(){
        const kcAdminClient = await new KeycloakAdminClient().getClient();
        const delUser = await kcAdminClient.users.del();
        return delUser
    }

    // public async addUserToGroup(group:Group, user:User){
    //     const result = await kcAdminClient.users.addToGroup({
    //         groupId: group.id,
    //         id: user.id
    //     })
    //     return result
    // }

    // public async removeUserFromGroup(group:Group, user:User){
    //     const result = await kcAdminClient.users.delFromGroup({
    //         groupId: group.id,
    //         id: user.id
    //     })
    //     return result

    // }   
}