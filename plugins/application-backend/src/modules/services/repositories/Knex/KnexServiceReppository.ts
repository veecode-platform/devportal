import { ServiceDto } from '../../dtos/ServiceDto';
import { ServiceMapper } from '../../mappers/ServiceMapper';
import { IServiceRepository } from '../IServiceRepository';
import { Service } from '../../domain/Service';
import { Knex } from 'knex';
import { ServiceResponseDto } from '../../dtos/ServiceResponseDto';

export class PostgresServiceRepository implements IServiceRepository {
  constructor(private readonly db: Knex) {}

  static async create(knex: Knex<any, any[]>): Promise<IServiceRepository> {
    return new PostgresServiceRepository(knex);
  }

  async getServiceByUser(name: string): Promise<Service[] | void> {
    const service = await this.db<Service>('services')
      .where('email', name)
      .select('*')
      .catch(error => console.error(error));
    return service;
  }

  async getService(): Promise<Service[]> {
    const service = await this.db<Service>('services')
      .select('*')
      .catch(error => console.error(error));
    const servicesDomain = ServiceResponseDto.create({ services: service });
    const responseData = await ServiceMapper.listAllServicesToResource(
      servicesDomain,
    );
    return responseData.services ?? [];
  }

  // method get one service by id
  async getServiceById(id: string): Promise<Service | string> {
    const service = await this.db<Service>('services')
      .where('id', id)
      .limit(1)
      .select()
      .catch(error => console.error(error));
    const serviceDomain = ServiceResponseDto.create({ serviceIt: service });
    const responseData = await ServiceMapper.listAllServicesToResource(
      serviceDomain,
    );
    return responseData.service ?? 'cannot find service';
  }

  async saveService(serviceDto: ServiceDto): Promise<Service> {
    const service: Service = Service.create({
      name: serviceDto.name,
      description: serviceDto.description,
      redirectUrl: serviceDto.redirectUrl,
      partnersId: serviceDto.partnersId,
      kongServiceName: serviceDto.kongServiceName,
      kongServiceId: serviceDto.kongServiceId,
    });
    const data = ServiceMapper.toPersistence(service);
    console.log(data);
    return service;
  }

  // method to delete service
  async deleteService(id: string): Promise<void> {
    await this.db<Service>('services')
      .where('id', id)
      .del()
      .catch(error => console.error(error));
  }

  async createService(serviceDto: ServiceDto): Promise<Service | string> {
    const service: Service = Service.create({
      name: serviceDto.name,
      description: serviceDto.description,
      redirectUrl: serviceDto.redirectUrl,
      partnersId: serviceDto.partnersId,
      kongServiceName: serviceDto.kongServiceName,
      kongServiceId: serviceDto.kongServiceId,
    });
    const data = await ServiceMapper.toPersistence(service);
    const createdService = await this.db('services')
      .insert(data)
      .catch(error => console.error(error));
    return createdService ? service : 'cannot create service';
  }
  // asyn function to update full service object
  async updateService(
    id: string,
    serviceDto: ServiceDto,
  ): Promise<Service | string> {
    const service: Service = Service.create({
      name: serviceDto.name,
      description: serviceDto.description,
      redirectUrl: serviceDto.redirectUrl,
      partnersId: serviceDto.partnersId,
      kongServiceName: serviceDto.kongServiceName,
      kongServiceId: serviceDto.kongServiceId,
    });
    const data = await ServiceMapper.toPersistence(service);
    const updatedService = await this.db('services')
      .where('id', id)
      .update(data)
      .catch(error => console.error(error));
    return updatedService ? service : 'cannot update service';
  }

  // async updateService(code: string, serviceDto: ServiceDto): Promise<Service | null> {
  //     return null;
  // }
  // async function to patch partial  service object partial class type
  async patchService(
    id: string,
    serviceDto: ServiceDto,
  ): Promise<Service | string> {
    const service: Service = Service.create({
      name: serviceDto.name,
      description: serviceDto.description,
      redirectUrl: serviceDto.redirectUrl,
      partnersId: serviceDto.partnersId,
      kongServiceName: serviceDto.kongServiceName,
      kongServiceId: serviceDto.kongServiceId,
    }); // try add ,id on service create
    //const data =await ServiceMapper.toPersistence(service);

    const patchedService = await this.db('services')
      .where('id', id)
      .update(serviceDto)
      .catch(error => console.error(error));
    return patchedService ? service : 'cannot patch service';
  }
}
