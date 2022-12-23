export class PluginDto {
  name: string;
  active: boolean;
  service: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    name: string,
    active: boolean,
    service: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.name = name;
    this.active = active;
    this.service = service;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
