import { resolvePackagePath } from '@backstage/backend-common';
import { Application1} from './application1';
import { Knex } from 'knex';
import { ApplicationDto } from './application-dto';
import { InputError, NotFoundError ,CustomErrorBase} from '@backstage/errors';
import { Logger } from 'winston';
import { ResponseDto } from './responsedto';
import { Application } from './application';

const migrationsDir = resolvePackagePath(
  '@internal/plugin-application-backend',
  'migrations',
);

export class DatabaseHandler {

  static async create(knex: Knex): Promise<DatabaseHandler> {
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    return new DatabaseHandler(knex);
  }
  constructor(private readonly db: Knex) {}

  async createApplication(applicationDto: ApplicationDto): Promise<Partial<Application> | unknown> {
    const {
      creator,
      name,
      serviceName,
      description,
      active,
      statusKong,
    } = applicationDto;
  const application: Application =new Application(
    creator,
    name,
    serviceName,
    description,
    statusKong,
    active)
    console.log(application);
    await this.db<Application>('application').insert(application).catch(error => console.error(error));
    return application;
  }

 // get all application from database return array of application or error
  async getApplication(): Promise<Application[] | void> {
    const application = await this.db<Application>('application').select('*').catch(error => console.error(error));
    return application;
  }
  
}
