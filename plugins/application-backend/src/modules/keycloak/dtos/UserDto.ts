export class UserDto {

    enabled: Boolean;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
    
    constructor(enabled:boolean,username:string, createdAt:Date, updatedAt:Date, email?:string, firstName?:string, lastName?:string) {
  
      this.enabled = enabled;
      this.username = username;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
 