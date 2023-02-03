import { Service } from '../domain/Service';
import { ServiceResponseDto } from '../dtos/ServiceResponseDto';

export class ServiceMapper {
  static async toPersistence(service: Service) {

    return {
      id: service._id,
      name: service.props.name,
      active: service.props.active,
      description: service.props.description,
      partnersId: service.props.partnersId,
      redirectUrl: service.props.redirectUrl,
      kongServiceName: service.props.kongServiceName,
      kongServiceId: service.props.kongServiceId,
      createdAt: service.props.createdAt,
      securityType: service.props.securityType,
      rateLimiting: service.props.rateLimiting
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
