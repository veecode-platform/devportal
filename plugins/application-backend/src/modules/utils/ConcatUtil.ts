import { ApplicationDto } from '../applications/dtos/ApplicationDto';

export const serviceConcatGroup = (service: string): string => {
  return service + '-group';
};

export const appNameConcatPatternId = (
  application: ApplicationDto,
): string => {
  return application.name + 'patternId';
};
