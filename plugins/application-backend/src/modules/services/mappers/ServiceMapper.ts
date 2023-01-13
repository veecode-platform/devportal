import { Service } from '../domain/Service';
import { ServiceResponseDto } from '../dtos/ServiceResponseDto';

export class ServiceMapper {
  static async toPersistence(service: Service) {
    console.log('serviceMapper',service._id)
    return {
      id: service._id,
      name: service.name,
      active: service.active,
      description: service.description,
      partnersId: service.partnersId,
      redirectUrl: service.redirectUrl,
      kongServiceName: service.kongServiceName,
      kongServiceId: service.kongServiceId,
      createdAt: service.createdAt,
      securityType: service.securityType,
      rateLimiting: service.rateLimiting
    }
    
  }
  static async listAllServicesToResource(
    serviceResponseDto: ServiceResponseDto,
  ) {
    return {
      services: serviceResponseDto.props.services ?? [],
      service: serviceResponseDto.props.service ?? '',
    };
  }
}
