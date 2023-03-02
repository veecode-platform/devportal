import { ApplicationDto } from '../applications/dtos/ApplicationDto';
import { Application } from '../applications/domain/Application';

export const serviceConcatGroup = (service: string): string => {
  return `${service  }-group`;
};

export const appNameConcatParternId = (application: Application): string => {
  return `${application.name  }-${  application.parternId}`;
};

export const appDtoNameConcatParternId = (
  applicationDto: ApplicationDto,
): string => {
  return `${applicationDto.name  }-${  applicationDto.parternId}`;
};
