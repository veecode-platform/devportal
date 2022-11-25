import { Service } from "../domain/Service";
import { ServiceResponseDto } from "../dtos/ServiceResponseDto";

export class ServiceMapper{
  static async toPersistence(service: Service) {
    return {
      id: service._id,
      name: service.props.name,
      description: service.props.description,
      kongServiceName: service.props.kongServiceName,
      kongServiceId: service.props.kongServiceId,
      createdAt: service.props.createdAt,
    }
  }
  static async listAllServicesToResource(serviceResponseDto : ServiceResponseDto){
    return {
      services: serviceResponseDto.props.services ?? [],
      service: serviceResponseDto.props.service ?? "",
    }
  }
}