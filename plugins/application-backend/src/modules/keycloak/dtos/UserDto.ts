export class UserDto {

    username: string;
    realm:string;
    
    constructor(username:string, realm:string) {
        this.realm = realm
        this.username = username;
    }
}
 
export class UpdateUserDto {
    
    username?: string;
    realm?: string;
    id?:string;
    groups?: string[];
    realmRoles?: string[];
    enabled?: boolean;
    email?: string;
    emailVerified?:boolean;
    firstName?: string;
    lastName?: string;
    
    constructor(
        username:string, realm:string, enabled: boolean, id:string, groups:string[], realmRoles:string[], 
        email:string, emailVerified:boolean, firstName:string, lastName:string
    ) 
    {
        this.realm = realm;
        this.username = username;
        this.enabled = enabled;
        this.id = id; 
        this.groups = groups;
        this.realmRoles = realmRoles;
        this.email = email;
        this.emailVerified = emailVerified;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}