export class PartnerDto {

    name:string;
    email:string;
    celular: string;
    servicesId: string[];
    applicationId: string[];
    createdAt?:Date;
    updatedAt?:Date;
    
    constructor(name:string, email:string, celular:string, servicesId:string[], applicationId: string[], createdAt:Date,updatedAt:Date) {
  
      this.name = name;
      this.email = email;
      this.celular = celular;
      this.servicesId = servicesId;
      this.applicationId = applicationId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      
    }
  }
  