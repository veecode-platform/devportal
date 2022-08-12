import { application } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Entity } from './entity';
// application  class using uuid npm dependency as primary key and contructor
 export type ApplicationProps = {
  creator: string;
  name: string;
  serviceName: string[];
  description: string;
  active?: boolean;
  statusKong?: string;
  createdAt?: Date;
  updatedAt?: Date;
  consumerName?: string[];
}

export class Application{
  creator: string;
  name: string;
  serviceName: string[];
  description: string;
  statusKong?: string;
  active?: boolean;
  id?:string;
  consumerName?: string[];
  updatedAt?: Date;
  createdAt?: Date;
  constructor(
    creator: string,
    name: string,
    serviceName: string[],
    description: string,
    statusKong?: string,
    active?: boolean,
    id?:string,
    consumerName?: string[],
    updatedAt?: Date,
    createdAt?: Date,
    ) 
    {
    if(!id){
        this.id = uuidv4();
    }
    this.createdAt = createdAt ?? new Date();
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
