import { v4 as uuidv4 } from 'uuid';
// application  class using uuid npm dependency as primary key and contructor
export class Application {
  id?: string;
  creator: string;
  name: string;
  serviceName: string[];
  description: string;
  active: boolean;
  statusKong?: string;
  createdAt?: Date;
  updatedAt?: Date;
  consumerName?: string[];

  constructor(id:string,creator: string,name: string,serviceName: string[],description: string,active: boolean,statusKong: string,updatedAt?: Date,createdAt?: Date,consumerName?: string[]) {
    
    if (!id) {
      this.id = uuidv4();
    }
    if (!createdAt) {
      this.createdAt = new Date();
    }
    this.creator = creator;
    this.name = name;
    this.serviceName = serviceName;
    this.description = description;
    this.active = active;
    this.statusKong = statusKong;
    this.updatedAt = updatedAt;
    this.consumerName = consumerName;
  }
}
export enum Status{
  active,
  inactive,
  pending,
  deleted,
}
