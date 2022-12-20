export class UserDto {

    username: string;
    realm:string;
    
    constructor(username:string, realm:string) {
        this.realm = realm
        this.username = username;
    }
  }
 