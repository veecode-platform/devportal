import { Knex } from "knex";
import { PartnerApplication } from "../../domain/PartnerApplication";

export class PostgresPartnerApplicationRepository{
    constructor(private readonly db: Knex) { }
    async total(): Promise<number> {
        return await (
            await this.db<PartnerApplication>('partner_application').select('*')
        ).length;
    }


    static async create(knex: Knex<any, any[]>) {
        return new PostgresPartnerApplicationRepository(knex);
    }

    async getApplicationsByPartner(partner_id: string): Promise<PartnerApplication[] | unknown> {
        const applications = await this.db<PartnerApplication>('partner_application')
            .innerJoin('application', 'partner_application.application_id', 'application.id')
            .select('application_id')
            .where('partner_id', partner_id)
            .catch(error => console.error(error));
        console.log('applications: ', applications)
        return applications
    }
}