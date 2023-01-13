import { ApplicationDto } from "../dtos/ApplicationDto";
import { Application } from "../domain/Application";

export interface IApplicationRepository {
  getApplication(limit: number, offset: number): Promise<Application[]>;
  getApplicationByUser(email:string): Promise<Application[] | void>;
  getApplicationById(id: string): Promise<Application| string>;
  saveApplication(applicationDto: ApplicationDto): Promise<Application>;
  deleteApplication(id: string): Promise<void>;
  createApplication(applicationDto: ApplicationDto): Promise<Application | string>;
  patchApplication(id: string, applicationDto: ApplicationDto): Promise<Application | string>;
  associate(id: string, servicesId: string[]): any;
  total(): Promise<number>;
  
  // updateApplication(code:string,applicationDto:ApplicationDto): Promise<Application>;
}