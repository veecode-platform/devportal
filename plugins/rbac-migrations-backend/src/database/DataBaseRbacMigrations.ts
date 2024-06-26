import { Knex } from "knex";
import { LoggerService, resolvePackagePath } from "@backstage/backend-plugin-api";
import { PluginDatabaseManager } from "@backstage/backend-common";

const migrationsDir = resolvePackagePath(
    '@internal/plugin-rbac-migrations-backend',
    'migrations'
)

export class DatabaseRbacMigrations {

    private constructor(
        private readonly db: Knex,
        private readonly logger: LoggerService
    ) { }

    public static async create(options: {
        database: PluginDatabaseManager,
        skipMigrations?: boolean,
        logger: LoggerService
    }): Promise<DatabaseRbacMigrations> {
        const { database, skipMigrations, logger } = options;
        const client = await database.getClient();

        if (!database.migrations?.skip && !skipMigrations) {
            await client.migrate.latest({
                directory: migrationsDir
            })
        }
        return new DatabaseRbacMigrations(client, logger)
    }
}