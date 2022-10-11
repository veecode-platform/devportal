import { DevService } from "../domain/DevService";

export class DevServiceMapper{

  static async toPersistence(devService: DevService) {
    return {
      id: devService._id,
      creator: devService.props.creator,
      name: devService.props.name,
      kong_service: devService.props.kongService,
      description: devService.props.description,
      enable: devService.props.enable,
      created_at: devService.props.createdAt,
      redirect_url: devService.props.redirectUrl,
    }
  }

}

