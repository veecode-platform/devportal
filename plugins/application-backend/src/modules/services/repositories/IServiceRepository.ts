import { ServiceDto } from "../dtos/ServiceDto";
import { Service } from "../domain/Service";

export interface IServiceRepository {
  getService(): Promise<Service[]>;
  getServiceByUser(email:string): Promise<Service[] | void>;
  getServiceById(id: string): Promise<Service| string>;
  saveService(serviceDto: ServiceDto): Promise<Service>;
  deleteService(id: string): Promise<void>;
  createService(serviceDto: ServiceDto): Promise<Service | string>;
  patchService(id: string, serviceDto: ServiceDto): Promise<Service | string>;
}