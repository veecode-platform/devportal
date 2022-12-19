export class ServiceDto {
  name: string;
  description: string;
  redirectUrl: string;
  partnersId: string[];
  kongServiceName: string;
  kongServiceId: string;
  rateLimiting: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    name: string,
    description: string,
    partnersId: string[],
    redirectUrl: string,
    kongServicename: string,
    kongServiceId: string,
    rateLimiting: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.name = name;
    this.description = description;
    this.redirectUrl = redirectUrl;
    this.partnersId = partnersId;
    this.kongServiceName = kongServicename;
    this.kongServiceId = kongServiceId;
    this.rateLimiting = rateLimiting;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
