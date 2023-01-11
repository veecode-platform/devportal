import { Knex } from 'knex';
import { SECURITY, Service } from '../../domain/Service';
import { ServiceDto } from '../../dtos/ServiceDto';
import { ServiceResponseDto } from '../../dtos/ServiceResponseDto';
import { ServiceMapper } from '../../mappers/ServiceMapper';
import { IServiceRepository } from '../IServiceRepository';



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

  async getService(limit: number, offset: number): Promise<Service[]> {
    const service = await this.db<Service>('services')
      .select('*')
      .limit(limit)
      .offset(offset)
      .catch(error => console.error(error));
    const servicesDomain = ServiceResponseDto.create({ services: service });
    console.log('AQUI')
    console.log('Aqui são as services', service);
    const responseData = await ServiceMapper.listAllServicesToResource(
      servicesDomain,
    );

    return responseData.services ?? [];
  }

  // method get one service by id
  async getServiceById(id: string): Promise<Service> {
    const service= await this.db<Service>('services')
      .where('id', id)
      .limit(1)
      .select()
      .catch(error => console.error(error));
    const serviceDomain = ServiceResponseDto.create({ serviceIt: service });
    const responseData = await ServiceMapper.listAllServicesToResource(
      serviceDomain,
    );
    console.log('CONSOLE LOG DA SERVICE REPOSITORY: ', typeof service)
    return service;
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
      rateLimiting: serviceDto.rateLimiting,
      securityType: serviceDto.securityType,
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
      active: serviceDto.active,
      description: serviceDto.description,
      redirectUrl: serviceDto.redirectUrl,
      partnersId: serviceDto.partnersId,
      kongServiceName: serviceDto.kongServiceName,
      kongServiceId: serviceDto.kongServiceId,
      rateLimiting: serviceDto.rateLimiting,
      securityType: serviceDto.securityType,
    });
    if (serviceDto.securityType.valueOf() != 'none') {
    }
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
      rateLimiting: serviceDto.rateLimiting,
      securityType: serviceDto.securityType,
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
    serviceDto: Service,
  ): Promise<Service | string> {
    const service: Service = Service.create({
      name: serviceDto.name as string,
      active: serviceDto.active as boolean,
      description: serviceDto.description as string, 
      redirectUrl: serviceDto.redirectUrl as string,
      partnersId: serviceDto.partnersId as string[],
      kongServiceName: serviceDto.kongServiceName as string,
      kongServiceId: serviceDto.kongServiceId as string,
      securityType: serviceDto.securityType as SECURITY,
      rateLimiting: serviceDto.rateLimiting as number,
    }); // try add ,id on service create
    //const data =await ServiceMapper.toPersistence(service);

    const patchedService = await this.db('services')
      .where('id', id)
      .update(service)
      .catch(error => console.error(error));
    return patchedService ? service : 'cannot patch service';
  }
}
