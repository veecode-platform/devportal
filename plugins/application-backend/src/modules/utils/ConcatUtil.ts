import { ApplicationDto } from '../applications/dtos/ApplicationDto';

export const serviceConcatGroup = (service: string): string => {
  return service + '-group';
};

export const appNameConcatParternId = (
  application: ApplicationDto,
): string => {
  return application.name + 'patternId';
};
