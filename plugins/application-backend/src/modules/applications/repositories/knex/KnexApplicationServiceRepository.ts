import { Knex } from "knex";
import { ApplicationService } from "../../domain/ApplicationService";
import { ApplicationServiceMapper } from "../../mappers/ApplicationServiceMapper";

export class PostgresApplicationServiceRepository {
    constructor(private readonly db: Knex) { }
    async total(): Promise<number> {
        return (
            await this.db<ApplicationService>('application_service').select('*')
        ).length;
    }


    static async create(knex: Knex<any, any[]>) {
        return new PostgresApplicationServiceRepository(knex);
    }

    async getServicesByApplication(application_id: string): Promise<any> {
        try{
            const service = await this.db<ApplicationService>('application_service')
            .innerJoin('service', 'application_service.service_id', 'service.id')
            .select('*')
            .where('application_id', application_id)
            .catch(error => console.error(error));
            return service

        }
        catch(e){
            throw new Error(`Impossible to fetch service from application ${application_id}`)
        }
    }


    async associate(applicationId: string, servicesId: string[]) {
        try{
            for (let i = 0; i < servicesId.length; i++) {
                const applicationService: ApplicationService = ApplicationService.create({
                    application_id: applicationId,
                    service_id: servicesId[i]
                })
                const data = await ApplicationServiceMapper.toPersistence(applicationService)
                await this.db<ApplicationService>('application_service').insert(data)
            }
        }
        catch(e){
            throw new Error(`Impossible to associate with ${applicationId}`)
        }
    }

    async deleteApplication(applicationId: string){
        try{
            await this.db<ApplicationService>('application_service').where("application_id", applicationId).del()
        }
        catch(e){
            throw new Error(`Impossible to delete ${applicationId}`)
        }

    }
    async deleteService(serviceId: string){
        try{
            await this.db<ApplicationService>('application_service').where("service_id", serviceId).del()
        }
        catch(e){
            throw new Error(`Impossible to delete ${serviceId}`)
        }

    }

}