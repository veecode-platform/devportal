import { ApplicationDto } from '../applications/dtos/ApplicationDto';
import { Application } from '../applications/domain/Application';

export const serviceConcatGroup = (service: string): string => {
  return `${service}-group`;
};

export const appNameConcatpartnersId = (application: Application, partnerId:String): string => {
  return `${application.name}-${partnerId}`
};

export const appDtoNameConcatpartnersId = (applicationDto: ApplicationDto, partnerId: String): string => {
  return `${applicationDto.name}-${partnerId}`;
};
