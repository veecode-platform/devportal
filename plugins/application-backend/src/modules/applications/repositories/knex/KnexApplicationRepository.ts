
import { ApplicationDto } from '../../dtos/ApplicationDto';
import { ApplicationMapper } from '../../mappers/ApplicationMapper';
import { IApplicationRepository } from '../IApplicationRepository'
import { Application } from '../../domain/Application';
import {Knex} from 'knex';
import { resolvePackagePath } from '@backstage/backend-common';
import { ApplicationResponseDto } from '../../dtos/ApplicationResponseDto';

const migrationsDir = resolvePackagePath(
  '@internal/plugin-application-backend',
  'migrations',
);

export class PostgresApplicationRepository implements IApplicationRepository {

  constructor(private readonly db: Knex) {}

  static async create(knex: Knex<any, any[]>): Promise<IApplicationRepository> {
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    return new PostgresApplicationRepository(knex);
  }

  async getApplication(): Promise<Application[]> {
    const application = await this.db<Application>('application').select('*').catch(error => console.error(error));
    const applicationsDomain = ApplicationResponseDto.create({ applications: application});
    const responseData = await ApplicationMapper.listAllApplicationsToResource(applicationsDomain)
    return responseData.applications ?? [];
  }

// method get one application by id
  async getApplicationById(id: string): Promise<Application | string> {
    const application = await this.db<Application>('application').where('id', id).limit(1).select().catch(error => console.error(error));
    const applicationDomain = ApplicationResponseDto.create({ applicationIt: application});
    const responseData = await ApplicationMapper.listAllApplicationsToResource(applicationDomain)
    return   responseData.application ?? "cannot find application";
  }

  async saveApplication(applicationDto: ApplicationDto): Promise<Application> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: applicationDto.name,
      serviceName: applicationDto.serviceName,
      description: applicationDto.description,
      active: applicationDto.active,
      statusKong: applicationDto.statusKong,
    });
    const data = ApplicationMapper.toPersistence(application);
    console.log(data)
    return application;
  }

// method to delete application
  async deleteApplication(id: string): Promise<void> {
   await this.db<Application>('application').where('id', id).del().catch(error => console.error(error));
  }

  async createApplication(applicationDto: ApplicationDto): Promise<Application | string> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: applicationDto.name,
      serviceName: applicationDto.serviceName,
      consumerName:applicationDto.consumerName,
      description: applicationDto.description,
      active: applicationDto.active,
      statusKong: applicationDto.statusKong,
    });
    const data =await ApplicationMapper.toPersistence(application);
    const createdApplication = await this.db('application').insert(data).catch(error => console.error(error));
    return createdApplication ? application : "cannot create application";
   }

    // async updateApplication(code: string, applicationDto: ApplicationDto): Promise<Application | null> {
    //     return null;
    // }

  }