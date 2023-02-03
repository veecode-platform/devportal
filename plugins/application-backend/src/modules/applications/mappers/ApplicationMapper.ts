import { Application } from '../domain/Application';
import { ApplicationResponseDto } from '../dtos/ApplicationResponseDto';

export class ApplicationMapper {
  static async toPersistence(application: Application) {
    return {
      id: application._id,
      creator: application.props.creator,
      name: application.props.name,
      active: application.props.active,
      parternId: application.props.parternId,
      servicesId: application.props.servicesId,
      externalId: application.props.externalId,
      createdAt: application.props.createdAt,
    };
  }
  static async listAllApplicationsToResource(
    applicationResponseDto: ApplicationResponseDto,
  ) {
    return {
      applications: applicationResponseDto.props.applications ?? [],
      application: applicationResponseDto.props.application ?? '',
      services: applicationResponseDto.props.services ?? [],
    };
  }
}
