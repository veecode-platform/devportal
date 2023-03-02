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

    async getServicesByApplication(application_id: string): Promise<ApplicationService[] | unknown> {
        const service = await this.db<ApplicationService>('application_service')
            .innerJoin('service', 'application_service.service_id', 'service.id')
            .select('service_id')
            .where('application_id', application_id)
            .catch(error => console.error(error));
        console.log('service: ', service)
        return service
    }


    async associate(applicationId: string, servicesId: string[]) {

        for (let i = 0; i < servicesId.length; i++) {
            const applicationService: ApplicationService = ApplicationService.create({
                application_id: applicationId,
                service_id: servicesId[i]
            })
            console.log('application service', applicationService)
            const data = await ApplicationServiceMapper.toPersistence(applicationService)
            console.log(data)
            await this.db<any>('application_service')
                .insert(data)
                .catch(error => console.error(error));

        }

    }
}