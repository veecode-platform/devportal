import { Application } from "../domain/Application";
import { ApplicationResponseDto } from "../dtos/ApplicationResponseDto";

export class ApplicationMapper{
  static async toPersistence(application: Application) {
    return {
      id: application._id,
      creator: application.props.creator,
      name: application.props.name,
      serviceName: application.props.serviceName,
      consumerName: application.props.consumerName,
      description: application.props.description,
      active: application.props.active,
      statusKong: application.props.statusKong,
      createdAt: application.props.createdAt,
    }
  }
  static async listAllApplicationsToResource(applicationResponseDto : ApplicationResponseDto){
   return {
   applications: applicationResponseDto.props.applications ?? [],
   application: applicationResponseDto.props.application ?? "",
   services: applicationResponseDto.props.services ?? [],
   }
  }
}
