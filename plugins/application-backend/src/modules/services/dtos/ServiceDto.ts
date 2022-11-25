export class ServiceDto {

    name:string;
    description:string;
    kongServiceName:string;
    kongServiceId:string;
    createdAt?:Date;
    updatedAt?:Date;
    
    constructor(name:string,description:string,kongServicename:string,kongServiceId:string, createdAt:Date,updatedAt:Date) {
  
      this.name = name;
      this.description = description;
      this.kongServiceName = kongServicename;
      this.kongServiceId = kongServiceId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
