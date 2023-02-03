export class PluginDto {
  name: string;
  active: boolean;
  pluginId: string;
  service: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    name: string,
    active: boolean,
    service: string,
    pluginId: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.name = name;
    
    this.active = active;
    this.service = service;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.pluginId = pluginId;
  }
}
