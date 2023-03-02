import { Knex } from 'knex';
import { Partner } from '../../domain/Partner';
import { PartnerDto } from '../../dtos/PartnerDto';
import { PartnerResponseDto } from '../../dtos/PartnerResponseDto';
import { PartnerMapper } from '../../mappers/PartnerMapper';
import { IPartnerRepository } from '../IPartnerRepository';

export class PostgresPartnerRepository implements IPartnerRepository {
  constructor(private readonly db: Knex) {}

  static async create(knex: Knex<any, any[]>): Promise<IPartnerRepository> {
    return new PostgresPartnerRepository(knex);
  }

  async getPartnerByUser(email: string): Promise<Partner[] | void> {
    const partner = await this.db<Partner>('partner')
      .where('email', email)
      .select('*')
      .catch(error => console.error(error));
    return partner;
  }

  async getPartnerByEmail(email: string): Promise<PartnerDto[] | void> {
    const partner = await this.db<PartnerDto>('partner')
      .where('email', email)
      .select('*')
      .catch(error => console.error(error));
    return partner;
  }

  async getPartner(offset: number, limit: number): Promise<Partner[]> {
    const partner = await this.db<Partner>('partner')
      .select('*')
      .offset(offset)
      .limit(limit)
      .catch(error => console.error(error));

    const partnerDomain = PartnerResponseDto.create({ partners: partner });
    const responseData = await PartnerMapper.listAllPartnersToResource(
      partnerDomain,
    );

    return responseData.partners ?? [];
  }

  public async total(): Promise<number> {
    return await (
      await this.db<Partner>('partner').select('*')
    ).length;
  }

  async findApplications(id: string) {
    const associates: PartnerDto = (await this.getPartnerById(
      id,
    )) as PartnerDto;
    return associates.applicationId;
  }

  // method get one partner by id
  async getPartnerById(id: string): Promise<Partner | string> {
    const partner = await this.db<Partner>('partner')
      .where('id', id)
      .limit(1)
      .select()
      .catch(error => console.error(error));
    const partnerDomain = PartnerResponseDto.create({ partnerIt: partner });
    const responseData = await PartnerMapper.listAllPartnersToResource(
      partnerDomain,
    );
    return responseData.partner ?? 'cannot find partner';
  }

  async savePartner(partnerDto: PartnerDto): Promise<Partner> {
    const partner: Partner = Partner.create({
      name: partnerDto.name,
      active: partnerDto.active,
      email: partnerDto.email,
      phone: partnerDto.phone
    });
    return partner;
  }

  // method to delete partner
  async deletePartner(id: string): Promise<void> {
    await this.db<Partner>('partner')
      .where('id', id)
      .del()
      .catch(error => console.error(error));
  }

  async createPartner(partnerDto: PartnerDto): Promise<Partner | string> {
    const partner: Partner = Partner.create({
      name: partnerDto.name,
      active: partnerDto.active,
      email: partnerDto.email,
      phone: partnerDto.phone
    });
    const data = await PartnerMapper.toPersistence(partner);
    const createdPartner = await this.db('partner')
      .insert(data)
      .catch(error => console.error(error));
    return createdPartner ? partner : 'cannot create partner';
  }
  // asyn function to update full partner object
  async updatePartner(
    id: string,
    partnerDto: PartnerDto,
  ): Promise<Partner | string> {
    const partner: Partner = Partner.create({
      name: partnerDto.name,
      active: partnerDto.active,
      email: partnerDto.email,
      phone: partnerDto.phone
    });
    const data = await PartnerMapper.toPersistence(partner);
    const updatedPartner = await this.db('partner')
      .where('id', id)
      .update(data)
      .catch(error => console.error(error));
    return updatedPartner ? partner : 'cannot update partner';
  }

  // async updatePartner(code: string, partnerDto: PartnerDto): Promise<Partner | null> {
  //     return null;
  // }
  // async function to patch partial  partner object partial class type
  async patchPartner(
    id: string,
    partnerDto: PartnerDto,
  ): Promise<Partner | string> {
    const partner: Partner = (await this.getPartnerById(id)) as Partner;
    const patchedPartner = await this.db('partner')
      .where('id', id)
      .update(partnerDto)
      .catch(error => console.error(error));
    return patchedPartner ? partner : 'cannot patch partner';
  }
}
