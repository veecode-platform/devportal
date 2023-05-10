import { SECURITY } from "../domain/Service";

export class ServiceDto {
  name: string;
  description: string;
  kongServiceName: string;
  kongServiceId: string;
  active: boolean;
  rateLimiting?: string;
  createdAt?: Date;
  updatedAt?: Date;
  securityType?: SECURITY;

  constructor(
    name: string,
    description: string,
    kongServicename: string,
    kongServiceId: string,
    active: boolean,
    rateLimiting?: string,
    createdAt?: Date,
    updatedAt?: Date,
    securityType?: SECURITY
  ) {
    this.name = name;
    this.description = description;
    this.kongServiceName = kongServicename;
    this.kongServiceId = kongServiceId;
    this.rateLimiting = rateLimiting;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.active = active;
    this.securityType = securityType;
  }
}
