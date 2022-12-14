export class PartnerDto {

    name:string;
    active: boolean;
    email:string;
    celular: string;
    servicesId: string[];
    applicationId: string[];
    createdAt?:Date;
    updatedAt?:Date;
    
    constructor(name:string, active: boolean, email:string, celular:string, servicesId:string[], applicationId: string[], createdAt:Date,updatedAt:Date) {
  
      this.name = name;
      this.active = active;
      this.email = email;
      this.celular = celular;
      this.servicesId = servicesId;
      this.applicationId = applicationId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      
    }
  }
  