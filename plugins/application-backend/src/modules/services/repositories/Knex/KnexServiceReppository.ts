import { Knex } from 'knex';
import { SECURITY, Service } from '../../domain/Service';
import { ServiceDto } from '../../dtos/ServiceDto';
import { ServiceResponseDto } from '../../dtos/ServiceResponseDto';
import { ServiceMapper } from '../../mappers/ServiceMapper';
import { IServiceRepository } from '../IServiceRepository';



export class PostgresServiceRepository implements IServiceRepository {
  constructor(private readonly db: Knex) {}
  async total(): Promise<number> {
    return await (
      await this.db<Service>('services').select('*')
    ).length;
  }

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

  async getService(limit: number, offset: number): Promise<Service[]> {
    const service = await this.db<Service>('services')
      .select('*')
      .limit(limit)
      .offset(offset)
      .catch(error => console.error(error));
    const servicesDomain = ServiceResponseDto.create({ services: service });
    const responseData = await ServiceMapper.listAllServicesToResource(
      servicesDomain,
    );

    return responseData.services ?? [];
  }

  // method get one service by id
  async getServiceById(id: string): Promise<Service> {
    const service = await this.db<Service>('services')
      .where('id', id)
      .limit(1)
      .select()
      .catch(error => console.error(error));
    const serviceDomain = ServiceResponseDto.create({ serviceIt: service });
    const responseData = await ServiceMapper.listAllServicesToResource(
      serviceDomain,
    );

    return responseData.service as Service;
  }

  async saveService(serviceDto: ServiceDto): Promise<Service> {
    const service: Service = Service.create({
      name: serviceDto.name,
      active: serviceDto.active,
      description: serviceDto.description,
      redirectUrl: serviceDto.redirectUrl,
      partnersId: serviceDto.partnersId,
      kongServiceName: serviceDto.kongServiceName,
      kongServiceId: serviceDto.kongServiceId,
      rateLimiting: serviceDto.rateLimiting as number,
      securityType: serviceDto.securityType as SECURITY,
    });
    await ServiceMapper.toPersistence(service);
    await this.db('services')
    .insert(service)
    .catch(error => console.error(error));
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
      active: serviceDto.active,
      description: serviceDto.description,
      redirectUrl: serviceDto.redirectUrl,
      partnersId: serviceDto.partnersId,
      kongServiceName: serviceDto.kongServiceName,
      kongServiceId: serviceDto.kongServiceId,
      rateLimiting: serviceDto.rateLimiting as number,
      securityType: serviceDto.securityType as SECURITY,
    });
    // if (serviceDto.securityType.valueOf() != 'none') {
    // }
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
      active: serviceDto.active,
      description: serviceDto.description,
      redirectUrl: serviceDto.redirectUrl,
      partnersId: serviceDto.partnersId,
      kongServiceName: serviceDto.kongServiceName,
      kongServiceId: serviceDto.kongServiceId,
      rateLimiting: serviceDto.rateLimiting as number,
      securityType: serviceDto.securityType as SECURITY,
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
    const service: Service = (await this.getServiceById(id)) as Service;
    const patchedService = await this.db('services')
      .where('id', id)
      .update(serviceDto)
      .catch(error => console.error(error));
    return patchedService ? service : 'cannot patch service';
  }
}
