import { Knex } from 'knex';
import { appDtoNameConcatpartnersId } from '../../../utils/ConcatUtil';
import { Application } from '../../domain/Application';
import { ApplicationDto } from '../../dtos/ApplicationDto';
import { ApplicationResponseDto } from '../../dtos/ApplicationResponseDto';
import { ApplicationMapper } from '../../mappers/ApplicationMapper';
import { IApplicationRepository } from '../IApplicationRepository';

export class PostgresApplicationRepository implements IApplicationRepository {
  constructor(private readonly db: Knex) {}
  async total(): Promise<number> {
    return await (await this.db<Application>('application').select('*')).length
  }

  static async create(knex: Knex<any, any[]>): Promise<IApplicationRepository> {
    return new PostgresApplicationRepository(knex);
  }

  async createApplication(
    applicationDto: ApplicationDto,
    partnerId: string
  ): Promise<Application | string> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name:  applicationDto.name,
      active: applicationDto.active,
      externalId: appDtoNameConcatpartnersId(applicationDto, partnerId),
      partner: partnerId
    });
    const data = await ApplicationMapper.toPersistence(application);
    const createdApplication = await this.db('application')
      .insert(data)
      .catch(error => console.error(error));
    return createdApplication ? application : 'cannot create application';
  }

  async getApplicationByCreator(creator: string, limit: number, offset:number): Promise<Application[] | void> {
    const application = await this.db<Application>('application')
      .select('*')
      .where('creator', creator)
      .limit(limit)
      .offset(offset)
      .catch(error => console.error(error));
    return application;
  }

  async getApplication(limit: number, offset: number): Promise<Application[]> {
    const application = await this.db<Application>('application')
      .select('*')
      .limit(limit)
      .offset(offset)
      .catch(error => console.error(error));
    const applicationDomain = ApplicationResponseDto.create({
      applications: application,
    });
    const responseData = await ApplicationMapper.listAllApplicationsToResource(
      applicationDomain,
    );
    return responseData.applications ?? [];
  }

  // method get one application by id
  async getApplicationById(id: string): Promise<Application | string> {
    const application = await this.db<Application>('application')
      .where('id', id)
      .limit(1)
      .select()
      .catch(error => console.error(error));
    const applicationDomain = ApplicationResponseDto.create({
      applicationIt: application,
    });
    const responseData = await ApplicationMapper.listAllApplicationsToResource(
      applicationDomain,
    );
    return responseData.application ?? 'cannot find application';
  }

  async saveApplication(applicationDto: ApplicationDto, partnerId: string): Promise<Application> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: appDtoNameConcatpartnersId(applicationDto, partnerId),
      active: applicationDto.active,
      externalId: appDtoNameConcatpartnersId(applicationDto, partnerId),
    });
    ApplicationMapper.toPersistence(application);
    return application;
  }

  // method to delete application
  async deleteApplication(id: string): Promise<void> {
    await this.db<Application>('application')
      .where('id', id)
      .del()
      .catch(error => console.error(error));
  }

  // asyn function to update full application object
  async updateApplication(
    id: string,
    applicationDto: ApplicationDto,
    partnerId: string
  ): Promise<Application | string> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: applicationDto.name,
      active: applicationDto.active,
      externalId: appDtoNameConcatpartnersId(applicationDto, partnerId)
    });
    // const data = await ApplicationMapper.toPersistence(application);
    const updatedApplication = await this.db('application')
      .where('id', id)
      .update(applicationDto)
      .catch(error => error);
    return updatedApplication ? application : 'cannot update application';
  }

  async patchApplication(
    id: string,
    applicationDto: ApplicationDto,
    _partnerId: string
  ): Promise<Application | string> {
    const application = {
      creator: applicationDto.creator,
      name: applicationDto.name,
      active: applicationDto.active,
    };
    
    const patchedApplication = await this.db('application')
      .where('id', id)
      .update(application)
      .catch(error => error);
    return patchedApplication 
  }
}
