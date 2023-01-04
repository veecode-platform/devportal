import { PartnerDto } from '../../dtos/PartnerDto';
import { PartnerMapper } from '../../mappers/PartnerMapper';
import { IPartnerRepository } from '../IPartnerRepository'
import { Partner } from '../../domain/Partner';
import { Knex } from 'knex';
import { PartnerResponseDto } from '../../dtos/PartnerResponseDto';



export class PostgresPartnerRepository implements IPartnerRepository {

  constructor(private readonly db: Knex) {}


  static async create(knex: Knex<any, any[]>): Promise<IPartnerRepository> {
    return new PostgresPartnerRepository(knex);
  }

  async getPartnerByUser(email:string): Promise<Partner[] | void> {
    const partner = await this.db<Partner>('partners').where("email", email).select('*').catch(error => console.error(error));
    return partner;
  }

  async getPartnerByEmail(email:string): Promise<PartnerDto[] | void> {
    const partner = await this.db<PartnerDto>('partners').where("email", email).select('*').catch(error => console.error(error));
    return partner;
  }

  async getPartner(offset: number, limit: number): Promise<Partner[]> {
    const partner = await this.db<Partner>('partners').select('*').offset(offset).limit(limit).catch(error => console.error(error));
    const partnersDomain = PartnerResponseDto.create({ partners: partner});
    const responseData = await PartnerMapper.listAllPartnersToResource(partnersDomain)
    return responseData.partners ?? [];
  }

  async findApplications(id: string){
    const associates: PartnerDto = await this.getPartnerById(id);
    return associates.applicationId;
  }

// method get one partner by id
  async getPartnerById(id: string): Promise<Partner | string> {
    const partner = await this.db<Partner>('partners').where('id', id).limit(1).select().catch(error => console.error(error));
    const partnerDomain = PartnerResponseDto.create({ partnerIt: partner});
    const responseData = await PartnerMapper.listAllPartnersToResource(partnerDomain)
    return   responseData.partner ?? "cannot find partner";
  }

  async savePartner(partnerDto: PartnerDto): Promise<Partner> {
    const partner: Partner = Partner.create({
      name: partnerDto.name,
      active: partnerDto.active,
      email: partnerDto.email,
      celular: partnerDto.celular,
      servicesId: partnerDto.servicesId,
      applicationId: partnerDto.applicationId
    });
    const data = PartnerMapper.toPersistence(partner);
    console.log(data)
    return partner;
  }

// method to delete partner
  async deletePartner(id: string): Promise<void> {
   await this.db<Partner>('partners').where('id', id).del().catch(error => console.error(error));
  }

  async createPartner(partnerDto: PartnerDto): Promise<Partner | string> {
    const partner: Partner = Partner.create({
        name: partnerDto.name,
        active: partnerDto.active,
        email: partnerDto.email,
        celular: partnerDto.celular,
        servicesId: partnerDto.servicesId,
        applicationId: partnerDto.applicationId
      });
    const data = await PartnerMapper.toPersistence(partner);
    const createdPartner = await this.db('partners').insert(data).catch(error => console.error(error));
    return createdPartner ? partner : "cannot create partner";
   }
    // asyn function to update full partner object
    async updatePartner(id: string, partnerDto: PartnerDto): Promise<Partner | string> {
        const partner: Partner = Partner.create({
            name: partnerDto.name,
            active: partnerDto.active,
            email: partnerDto.email,
            celular: partnerDto.celular,
            servicesId: partnerDto.servicesId,
            applicationId: partnerDto.applicationId
          });
      const data =await PartnerMapper.toPersistence(partner);
      const updatedPartner = await this.db('partners').where('id', id).update(data).catch(error => console.error(error));
      return updatedPartner ? partner : "cannot update partner";
      }

    // async updatePartner(code: string, partnerDto: PartnerDto): Promise<Partner | null> {
    //     return null;
    // }
 // async function to patch partial  partner object partial class type
  async patchPartner(id: string, partnerDto: PartnerDto): Promise<Partner | string> {
    const partner: Partner = Partner.create({
        name: partnerDto.name,
        active: partnerDto.active,
        email: partnerDto.email,
        celular: partnerDto.celular,
        servicesId: partnerDto.servicesId,
        applicationId: partnerDto.applicationId
      });// try add ,id on partner create
    //const data =await PartnerMapper.toPersistence(partner);
    
    const patchedPartner = await this.db('partners').where('id', id).update(partnerDto).catch(error => console.error(error));
    return patchedPartner ? partner : "cannot patch partner";
  }

}