import { Knex } from "knex";
import { resolvePackagePath } from "@backstage/backend-common";

const migrationsDir = resolvePackagePath(
  '@internal/plugin-devservice-backend',
  'migrations',
);
export class KnexClient {  
  constructor(private db:Knex) {}
  static async create(knex: Knex<any, any[]>): Promise<KnexClient> {
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    return new KnexClient(knex);
  }
}