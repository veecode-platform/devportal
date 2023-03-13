export class PartnerDto {
  name: string;
  active: boolean;
  email: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    name: string,
    active: boolean,
    email: string,
    phone: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.name = name;
    this.active = active;
    this.email = email;
    this.phone = phone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
