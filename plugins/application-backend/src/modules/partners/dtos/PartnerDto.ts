export class PartnerDto {

    name:string;
    applicationId: string[];
    createdAt?:Date;
    updatedAt?:Date;
    
    constructor(name:string, applicationId: string[], createdAt:Date,updatedAt:Date) {
  
      this.name = name;
      this.applicationId = applicationId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      
    }
  }
  