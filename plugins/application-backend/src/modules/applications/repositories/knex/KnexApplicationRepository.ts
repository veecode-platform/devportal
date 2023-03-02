// import { resolvePackagePath } from '@backstage/backend-common';
import { Knex } from 'knex';
import { appDtoNameConcatParternId } from '../../../utils/ConcatUtil';
import { Application } from '../../domain/Application';
import { ApplicationDto } from '../../dtos/ApplicationDto';
import { ApplicationResponseDto } from '../../dtos/ApplicationResponseDto';
import { ApplicationMapper } from '../../mappers/ApplicationMapper';
import { IApplicationRepository } from '../IApplicationRepository';

/* const migrationsDir = resolvePackagePath(
  '@internal/plugin-application-backend',
  'migrations',
);
const seedsDir = resolvePackagePath(
  '@internal/plugin-application-backend',
  'seeds',
);*/

export class PostgresApplicationRepository implements IApplicationRepository {
  constructor(private readonly db: Knex) {}
  async total(): Promise<number> {
    return await (await this.db<Application>('applications').select('*')).length
  }

  static async create(knex: Knex<any, any[]>): Promise<IApplicationRepository> {
    // await knex.migrate.latest({
    //   directory: migrationsDir,
    // });
    // // await knex.seed.run({ directory: seedsDir });
    return new PostgresApplicationRepository(knex);
  }

  async getApplicationByUser(email: string): Promise<Application[] | void> {
    const application = await this.db<Application>('applications')
      .where('email', email)
      .select('*')
      .catch(error => console.error(error));
    return application;
  }

  async associate(id: string, servicesId: string[]) {
    const application: Application = await this.getApplicationById(id) as Application;
    const arrayConsumerName = application.servicesId;
    if (arrayConsumerName !== null) {
      for (let index = 0; index < servicesId.length; index++) {
        application.servicesId?.push(servicesId[index]);
      }
    } else {
      application.servicesId = servicesId;
    }
    await this.patchApplication(id, application as any);
    return application;
  }

  async getApplication(limit: number, offset: number): Promise<Application[]> {
    const application = await this.db<Application>('applications')
      .select('*')
      .limit(limit)
      .offset(offset)
      .catch(error => console.error(error));
    const applicationsDomain = ApplicationResponseDto.create({
      applications: application,
    });
    const responseData = await ApplicationMapper.listAllApplicationsToResource(
      applicationsDomain,
    );
    return responseData.applications ?? [];
  }

  // method get one application by id
  async getApplicationById(id: string): Promise<Application | string> {
    const application = await this.db<Application>('applications')
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

  async saveApplication(applicationDto: ApplicationDto): Promise<Application> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: appDtoNameConcatParternId(applicationDto),
      parternId: applicationDto.parternId,
      servicesId: applicationDto.servicesId,
      active: applicationDto.active,
      externalId: appDtoNameConcatParternId(applicationDto),
    });
    ApplicationMapper.toPersistence(application);
    return application;
  }

  // method to delete application
  async deleteApplication(id: string): Promise<void> {
    await this.db<Application>('applications')
      .where('id', id)
      .del()
      .catch(error => console.error(error));
  }

  async createApplication(
    applicationDto: ApplicationDto,
  ): Promise<Application | string> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: appDtoNameConcatParternId(applicationDto),
      active: applicationDto.active,
      parternId: applicationDto.parternId,
      servicesId: applicationDto.servicesId,
      externalId: appDtoNameConcatParternId(applicationDto)
    });
    const data = await ApplicationMapper.toPersistence(application);
    const createdApplication = await this.db('applications')
      .insert(data)
      .catch(error => console.error(error));
    return createdApplication ? application : 'cannot create application';
  }
  // asyn function to update full application object
  async updateApplication(
    id: string,
    applicationDto: ApplicationDto,
  ): Promise<Application | string> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: appDtoNameConcatParternId(applicationDto),
      active: applicationDto.active,
      parternId: applicationDto.parternId,
      servicesId: applicationDto.servicesId,
      externalId: appDtoNameConcatParternId(applicationDto)
    });
    // const data = await ApplicationMapper.toPersistence(application);
    const updatedApplication = await this.db('applications')
      .where('id', id)
      .update(applicationDto)
      .catch(error => error);
    return updatedApplication ? application : 'cannot update application';
  }

  // async updateApplication(code: string, applicationDto: ApplicationDto): Promise<Application | null> {
  //     return null;
  // }
  // async function to patch partial  application object partial class type
  async patchApplication(
    id: string,
    applicationDto: ApplicationDto,
  ): Promise<Application | string> {
    const application: Application = Application.create({
      creator: applicationDto.creator,
      name: appDtoNameConcatParternId(applicationDto),
      active: applicationDto.active,
      parternId: applicationDto.parternId,
      servicesId: applicationDto.servicesId,
      externalId: appDtoNameConcatParternId(applicationDto)
    }); // try add ,id on application create
    // const data =await ApplicationMapper.toPersistence(application);

    const patchedApplication = await this.db('applications')
      .where('id', id)
      .update(applicationDto)
      .catch(error => error);
    return patchedApplication ? application : 'cannot patch application';
  }
}
