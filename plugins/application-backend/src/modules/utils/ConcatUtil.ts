import { ApplicationDto } from '../applications/dtos/ApplicationDto';
import { Application } from '../applications/domain/Application';

export const serviceConcatGroup = (service: string): string => {
  return service + '-group';
};

export const appNameConcatpartnersId = (application: Application): string => {
  return application.name + '-' + application.partnersId;
};

export const appDtoNameConcatpartnersId = (
  applicationDto: ApplicationDto,
): string => {
  return applicationDto.name + '-' + applicationDto.partnersId;
};
