export class PartnerDto {
  name: string;
  active: boolean;
  email: string;
  phone: string;
  servicesId: string[];
  applicationId: string[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    name: string,
    active: boolean,
    email: string,
    phone: string,
    servicesId: string[],
    applicationId: string[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.name = name;
    this.active = active;
    this.email = email;
    this.phone = phone;
    this.servicesId = servicesId;
    this.applicationId = applicationId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
