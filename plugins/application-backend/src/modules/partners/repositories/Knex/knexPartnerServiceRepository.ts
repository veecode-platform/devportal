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
            .select('*')
            .where('partner_id', partner_id)
            .catch(error => console.error(error));
        return services
    }

    async getPartnerByservice(serviceId: string): Promise<PartnerService[] | unknown> {
        const services = await this.db<PartnerApplication>('partner_service')
            .innerJoin('service', 'partner_service.service_id', 'service.id')
            .select('*')
            .where('service_id', serviceId)
            .catch(error => console.error(error));
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

    async associatePartnersToService(partners: string[], serviceId: string){
        try{
            if (partners.length === 0) return;
            partners.forEach(async (p)=>{
                const associate: PartnerService = PartnerService.create({
                    partner_id: p,
                    service_id: serviceId
                })
                const data = await PartnerServiceMapper.toPersistence(associate)
                await this.db<any>('partner_service').insert(data).catch(error => console.error(error)); 
            })
        }
        catch(e){
            throw new Error("impossible to associate")
        }
    }

    async removeServicesFromPartner(partnerId: string, servicesId: string[]){
        try{
            servicesId.forEach(
                async service => {
                    await this.db<any>('partner_service').where("service_id", service).andWhere("partner_id", partnerId).del()
                }               
            )
        }
        catch(error){
            return error
        }
    }

    async deleteService(serviceId: string){
        try{
            await this.db<PartnerService>('partner_service').where("service_id", serviceId).del()
        }
        catch(e){
            throw new Error(`Impossible to delete ${serviceId}`)
        }

    }
}