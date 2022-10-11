import { DevService } from "../../domain/DevService";
import { DevServiceDto } from "../../dtos/DevServiceDto";
import { IDevServiceRepository } from "../IDevServiceRepository";
import { Knex } from "knex";
import { resolvePackagePath } from "@backstage/backend-common";
import { User } from "../../../user/domain/User";
import { GetDevServiceDto } from "../../dtos/GetDevServiceDto";
import { DevServiceMapper } from "../../mappers/DevServiceMapper";

const migrationsDir = resolvePackagePath(
  '@internal/plugin-devservice-backend',
  'migrations',
);

export class KnexDevServiceRepository implements IDevServiceRepository {
  private readonly knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }
  static async create(knex: Knex<any, any[]>): Promise<IDevServiceRepository> {
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    return new KnexDevServiceRepository(knex);
  }
  async getDevService(): Promise<DevService[] | void> {
    const list = await this.knex<DevService>('devService').select('*').catch(error => console.error(error));
    return list;
  }
  async getDevServiceById(id: string): Promise<GetDevServiceDto>  {
    const devService:DevService[] = await this.knex<DevService>('devService').where('id', id).limit(1).select()
    const users = await this.knex<User>('users').where('devServiceId', id).select()
    const devServiceWithUsers = { devService:devService[0], users: users };
    return devServiceWithUsers;
  }

  saveDevService(devServiceDto: DevServiceDto): Promise<DevService> {
    throw new Error("Method not implemented.");
  }

  deleteDevService(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createDevService(devServiceDto: DevServiceDto): Promise<string | DevService> {
    const devService: DevService = DevService.create({
      creator: devServiceDto.creator,
      name: devServiceDto.name,
      kongService: devServiceDto.kongService,
      description: devServiceDto.description,
      enable: devServiceDto.enable,
      redirectUrl: devServiceDto.redirectUrl,
    });
    const data =await DevServiceMapper.toPersistence(devService);
    const createdDevService = await this.knex('devservices').insert(data).catch(error => console.error(error));
    return createdDevService ? devService : "cannot create application";
  }

}
  