import { ApplicationDto } from '../../dtos/ApplicationDto';
import { ApplicationMapper } from '../../mappers/ApplicationMapper';
import { IApplicationRepository } from '../IApplicationRepository'
import { Application } from '../../domain/Application';
import { Knex } from 'knex';
import { resolvePackagePath } from '@backstage/backend-common';
import { ApplicationResponseDto } from '../../dtos/ApplicationResponseDto';

const migrationsDir = resolvePackagePath(
  '@internal/plugin-application-backend',
  'migrations',
);
const seedsDir = resolvePackagePath(
  '@internal/plugin-application-backend',
  'seeds',
);

export class PostgresApplicationRepository implements IApplicationRepository {

  constructor(private readonly db: Knex) {}


  static async create(knex: Knex<any, any[]>): Promise<IApplicationRepository> {
    
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    await knex.seed.run({ directory: seedsDir });
    return new PostgresApplicationRepository(knex);
  }

  async getApplicationByUser(email:string): Promise<Application[] | void> {
    const application = await this.db<Application>('applications').where("email", email).select('*').catch(error => console.error(error));
    return application;
  }

  async getApplication(): Promise<Application[]> {
    const application = await this.db<Application>('applications').select('*').catch(error => console.error(error));
    const applicationsDomain = ApplicationResponseDto.create({ applications: application});
    const responseData = await ApplicationMapper.listAllApplicationsToResource(applicationsDomain)
    return responseData.applications ?? [];
  }

// method get one application by id
  async getApplicationById(id: string): Promise<Application | string> {
    const application = await this.db<Application>('applications').where('id', id).limit(1).select().catch(error => console.error(error));
    const applicationDomain = ApplicationResponseDto.create({ applicationIt: application});
    const responseData = await ApplicationMapper.listAllApplicationsToResource(applicationDomain)
    return   responseData.application ?? "cannot find application";
  }

  async saveApplication(applicationDto: ApplicationDto): Promise<Application> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: applicationDto.name,
      servicesId: applicationDto.servicesId,
      kongConsumerName: applicationDto.kongConsumerName,
      kongConsumerId: applicationDto.kongConsumerId,
      createdAt: applicationDto.createdAt,
      updateAt: applicationDto.updateAt
    });
    const data = ApplicationMapper.toPersistence(application);
    console.log(data)
    return application;
  }

// method to delete application
  async deleteApplication(id: string): Promise<void> {
   await this.db<Application>('applications').where('id', id).del().catch(error => console.error(error));
  }

  async createApplication(applicationDto: ApplicationDto): Promise<Application | string> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: applicationDto.name,
      servicesId: applicationDto.servicesId,
      kongConsumerName: applicationDto.kongConsumerName,
      kongConsumerId: applicationDto.kongConsumerId,
      createdAt: applicationDto.createdAt,
      updateAt: applicationDto.updateAt
    });
    const data = await ApplicationMapper.toPersistence(application);
    const createdApplication = await this.db('applications').insert(data).catch(error => console.error(error));
    return createdApplication ? application : "cannot create application";
   }
    // asyn function to update full application object
    async updateApplication(id: string, applicationDto: ApplicationDto): Promise<Application | string> {
      const application: Application = Application.create({
        creator: applicationDto.creator,
        name: applicationDto.name,
        servicesId: applicationDto.servicesId,
        kongConsumerName: applicationDto.kongConsumerName,
        kongConsumerId: applicationDto.kongConsumerId,
        createdAt: applicationDto.createdAt,
        updateAt: applicationDto.updateAt
      });
      const data =await ApplicationMapper.toPersistence(application);
      const updatedApplication = await this.db('applications').where('id', id).update(data).catch(error => console.error(error));
      return updatedApplication ? application : "cannot update application";
      }



    
    // async updateApplication(code: string, applicationDto: ApplicationDto): Promise<Application | null> {
    //     return null;
    // }
 // async function to patch partial  application object partial class type
  async patchApplication(id: string, applicationDto: ApplicationDto): Promise<Application | string> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: applicationDto.name,
      servicesId: applicationDto.servicesId,
      kongConsumerName: applicationDto.kongConsumerName,
      kongConsumerId: applicationDto.kongConsumerId,
      createdAt: applicationDto.createdAt,
      updateAt: applicationDto.updateAt
    });// try add ,id on application create
    //const data =await ApplicationMapper.toPersistence(application);
    
    const patchedApplication = await this.db('applications').where('id', id).update(applicationDto).catch(error => console.error(error));
    return patchedApplication ? application : "cannot patch application";
  }

}