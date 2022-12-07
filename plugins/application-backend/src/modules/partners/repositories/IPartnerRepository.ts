import { PartnerDto } from "../dtos/PartnerDto";
import { Partner } from "../domain/Partner";

export interface IPartnerRepository {
  getPartner(): Promise<Partner[]>;
  getPartnerByUser(email:string): Promise<Partner[] | void>;
  getPartnerById(id: string): Promise<Partner| string>;
  savePartner(partnerDto: PartnerDto): Promise<Partner>;
  deletePartner(id: string): Promise<void>;
  createPartner(partnerDto: PartnerDto): Promise<Partner | string>;
  patchPartner(id: string, partnerDto: PartnerDto): Promise<Partner | string>;
  findApplications(id: string): any;
 // updatePartner(code:string,partnerDto:PartnerDto): Promise<Partner>;
}