import { ApplicationDto } from "../dtos/ApplicationDto";
import { Application } from "../domain/Application";

export interface IApplicationRepository {
  getApplication(): Promise<Application[]>;
  getApplicationByUser(email:string): Promise<Application[] | void>;
  getApplicationById(id: string): Promise<Application| string>;
  saveApplication(applicationDto: ApplicationDto): Promise<Application>;
  deleteApplication(id: string): Promise<void>;
  createApplication(applicationDto: ApplicationDto): Promise<Application | string>;
  patchApplication(id: string, applicationDto: ApplicationDto): Promise<Application | string>;
  // updateApplication(code:string,applicationDto:ApplicationDto): Promise<Application>;
}