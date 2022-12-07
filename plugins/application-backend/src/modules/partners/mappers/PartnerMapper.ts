import { Partner } from "../domain/Partner";
import { PartnerResponseDto } from "../dtos/PartnerResponseDto";

export class PartnerMapper{
  static async toPersistence(partner: Partner) {
    return {
      id: partner._id,
      name: partner.props.name,
      applicationId: partner.props.applicationId,
      createdAt: partner.props.createdAt,
    }
  }
  static async listAllPartnersToResource(partnerResponseDto : PartnerResponseDto){
    return {
      partners: partnerResponseDto.props.partners ?? [],
      partner: partnerResponseDto.props.partner ?? "",
    }
  }
}
