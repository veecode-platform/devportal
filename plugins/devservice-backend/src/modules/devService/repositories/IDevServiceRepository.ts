import { DevService } from "../domain/DevService";
import { DevServiceDto } from "../dtos/DevServiceDto";
import { GetDevServiceDto } from "../dtos/GetDevServiceDto";

export interface IDevServiceRepository {
  getDevService(): Promise<DevService[] | void>;
  getDevServiceById(id: string): Promise<GetDevServiceDto>;
  saveDevService(devServiceDto: DevServiceDto): Promise<DevService>;
  deleteDevService(id: string): Promise<void>;
  createDevService(devServiceDto: DevServiceDto): Promise<DevService | string>;
  
  // updateApplication(code:string,applicationDto:ApplicationDto): Promise<Application>;
}