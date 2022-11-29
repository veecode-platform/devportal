import { Application } from "../domain/Application";
import { ApplicationResponseDto } from "../dtos/ApplicationResponseDto";

export class ApplicationMapper{
  static async toPersistence(application: Application) {
    return {
      id: application._id,
      creator: application.props.creator,
      name: application.props.name,
      servicesId: application.props.servicesId,
      kongConsumerName: application.props.kongConsumerName,
      kongConsumerId: application.props.kongConsumerId,
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
