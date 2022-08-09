// import { resolvePackagePath } from '@backstage/backend-common';
// import { Knex } from 'knex';

// const migrationsDir = resolvePackagePath(
//   '@backstage/plugin-bazaar-backend',
//   'migrations',
// );

// type Options = {
//   database: Knex;
// };

// export class DatabaseHandler {
//   static async create(options: Options): Promise<DatabaseHandler> {
//     const { database } = options;

//     await database.migrate.latest({
//       directory: migrationsDir,
//     });

//     return new DatabaseHandler(options);
//   }

//   private readonly database: Knex;

//   private constructor(options: Options) {
//     this.database = options.database;
//   }

//   private columns = [
//     'metadata.id',
//     'metadata.entity_ref',
//     'metadata.name',
//     'metadata.description',
//     'metadata.status',
//     'metadata.updated_at',
//     'metadata.community',
//     'metadata.size',
//     'metadata.start_date',
//     'metadata.end_date',
//     'metadata.responsible',
//   ];

//   async getMembers(id: string) {
//     return await this.database
//       .select('*')
//       .from('members')
//       .where({ item_id: id });
//   }

//   async addMember(id: number, userId: string, picture?: string) {
//     await this.database
//       .insert({
//         item_id: id,
//         user_id: userId,
//         picture: picture,
//       })
//       .into('members');
//   }

//   async deleteMember(id: number, userId: string) {
//     return await this.database('members')
//       .where({ item_id: id })
//       .andWhere('user_id', userId)
//       .del();
//   }

//   async getMetadataById(id: number) {
//     const coalesce = this.database.raw(
//       'coalesce(count(members.item_id), 0) as members_count',
//     );

//     return await this.database('metadata')
//       .select([...this.columns, coalesce])
//       .where({ 'metadata.id': id })
//       .groupBy(this.columns)
//       .leftJoin('members', 'metadata.id', '=', 'members.item_id');
//   }

//   async getMetadataByRef(entityRef: string) {
//     const coalesce = this.database.raw(
//       'coalesce(count(members.item_id), 0) as members_count',
//     );

//     return await this.database('metadata')
//       .select([...this.columns, coalesce])
//       .where({ 'metadata.entity_ref': entityRef })
//       .groupBy(this.columns)
//       .leftJoin('members', 'metadata.id', '=', 'members.item_id');
//   }

//   async insertMetadata(bazaarProject: any) {
//     const {
//       name,
//       entityRef,
//       community,
//       description,
//       status,
//       size,
//       startDate,
//       endDate,
//       responsible,
//     } = bazaarProject;

//     await this.database
//       .insert({
//         name,
//         entity_ref: entityRef,
//         community,
//         description,
//         status,
//         updated_at: new Date().toISOString(),
//         size,
//         start_date: startDate,
//         end_date: endDate,
//         responsible,
//       })
//       .into('metadata');
//   }

//   async updateMetadata(bazaarProject: any) {
//     const {
//       name,
//       id,
//       entityRef,
//       community,
//       description,
//       status,
//       size,
//       startDate,
//       endDate,
//       responsible,
//     } = bazaarProject;

//     return await this.database('metadata').where({ id: id }).update({
//       name,
//       entity_ref: entityRef,
//       description,
//       community,
//       status,
//       updated_at: new Date().toISOString(),
//       size,
//       start_date: startDate,
//       end_date: endDate,
//       responsible,
//     });
//   }

//   async deleteMetadata(id: number) {
//     return await this.database('metadata').where({ id: id }).del();
//   }

//   async getProjects() {
//     const coalesce = this.database.raw(
//       'coalesce(count(members.item_id), 0) as members_count',
//     );

//     return await this.database('metadata')
//       .select([...this.columns, coalesce])
//       .groupBy(this.columns)
//       .leftJoin('members', 'metadata.id', '=', 'members.item_id');
//   }
// }