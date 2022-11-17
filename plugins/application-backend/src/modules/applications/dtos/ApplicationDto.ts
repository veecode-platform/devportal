export class ApplicationDto {

  creator:string;
  name:string;
  serviceName:string[];
  description:string;
  active?:boolean;
  statusKong?:string;
  createdAt?:Date;
  updatedAt?:Date;
  consumerName?:string[];
  
  constructor(creator:string,name:string,serviceName:string[],description:string,active:boolean,createdAt:Date,updatedAt:Date,statusKong?:string,consumerName?:string[]) {
    this.creator = creator;
    this.name = name;
    this.serviceName = serviceName;
    this.description = description;
    this.active = active;
    this.statusKong = statusKong;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.consumerName = consumerName;
  }
}
// kong consumer class
export type Consumer = {
  id:string;
  username:string;
  custom_id:string;
  created_at:Date;
  updated_at:Date;
}
