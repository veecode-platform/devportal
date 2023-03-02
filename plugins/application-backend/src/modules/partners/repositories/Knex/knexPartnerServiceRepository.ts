import { Knex } from "knex";
import { PartnerApplication } from "../../domain/PartnerApplication";
import { PartnerService } from "../../domain/PartnerService";
import { PartnerServiceMapper } from "../../mappers/PartnerServiceMapper";

export class PostgresPartnerServiceRepository {
    constructor(private readonly db: Knex) { }
    async total(): Promise<number> {
        return await (
            await this.db<PartnerService>('partner_service').select('*')
        ).length;
    }


    static async create(knex: Knex<any, any[]>) {
        return new PostgresPartnerServiceRepository(knex);
    }

    async getServiceByPartner(partner_id: string): Promise<PartnerApplication[] | unknown> {
        const services = await this.db<PartnerApplication>('partner_service')
            .innerJoin('service', 'partner_service.service_id', 'service.id')
            .select('service_id')
            .where('partner_id', partner_id)
            .catch(error => console.error(error));
        console.log('service: ', services)
        return services
    }

    async associate(partnerId: string, services_id: string[]) {
        try {
            for (let i = 0; i < services_id.length; i++) {
                const partner: PartnerService = PartnerService.create({
                    partner_id: partnerId,
                    service_id: services_id[i]
                })
                const data = await PartnerServiceMapper.toPersistence(partner)
                await this.db<any>('partner_service')
                    .insert(data)
                    .catch(error => console.error(error));
            }
        } catch (error) {
            return error
        }

    }
}