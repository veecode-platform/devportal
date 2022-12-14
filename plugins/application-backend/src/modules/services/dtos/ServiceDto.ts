export class ServiceDto {

    name:string;
    description:string;
    redirectUrl: string;
    partnersId: string[];
    kongServiceName:string;
    kongServiceId:string;
    active: boolean;
    createdAt?:Date;
    updatedAt?:Date;
    
    constructor(name:string,description:string,partnersId:string[], active:boolean, redirectUrl:string, kongServicename:string,kongServiceId:string, createdAt:Date,updatedAt:Date) {
      this.name = name;
      this.description = description;
      this.active = active;
      this.redirectUrl = redirectUrl;
      this.partnersId = partnersId;
      this.kongServiceName = kongServicename;
      this.kongServiceId = kongServiceId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
