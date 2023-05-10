import { PluginDatabaseManager } from '@backstage/backend-common';
import { ConsumerGroup } from '../../kong/model/ConsumerGroup';
import { AclPlugin } from '../../kong/plugins/AclPlugin';
import { KeyAuthPlugin } from '../../kong/plugins/KeyAuthPlugin';
import { Oauth2Plugin } from '../../kong/plugins/Oauth2Plugin';
import { RateLimitingPlugin, RateLimitingType } from '../../kong/plugins/RateLimitingPlugin';
import { ConsumerGroupService } from '../../kong/services/ConsumerGroupService';
import { SECURITY } from '../domain/Service';
import { ServiceDto } from '../dtos/ServiceDto';
import { PostgresServiceRepository } from '../repositories/Knex/KnexServiceReppository';
import { PostgresPluginRepository } from '../../plugins/repositories/Knex/KnexPluginRepository';

/** @public */
export interface RouterOptions {
  database: PluginDatabaseManager;
}
export class ControllPlugin {
  private static _instance: ControllPlugin;

  public constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async applySecurityType(service: ServiceDto) {  
    try {
      const consumerGroupService = new ConsumerGroupService();
      if(service.securityType?.toString() === "none") return;
      const plugins = []

      const consumerGroup: ConsumerGroup = new ConsumerGroup(`${service.kongServiceName}-group`);
      await consumerGroupService.createConsumerGroup(consumerGroup);

      if (service.securityType?.toString() === SECURITY.OAUTH2.toString()) {
        const oauth2 = await Oauth2Plugin.Instance.configureOauth(service.kongServiceName);
        plugins.push({name: "oauth2", id: oauth2.id})
      } 
      if (service.securityType?.toString() === SECURITY.KEY_AUTH.toString()) {   
        const keyauth = await KeyAuthPlugin.Instance.configKeyAuthKongService(service.kongServiceName);
        plugins.push({name: "key-auth", id: keyauth.id})
      }
      if(service.rateLimiting !== "0" ){
        const rateLimiting = await RateLimitingPlugin.Instance.configRateLimitingKongService(service.kongServiceName, RateLimitingType.hour, service.rateLimiting as string)
        plugins.push({name: "rateLimiting", id: rateLimiting.id})
      }

      const acl = await AclPlugin.Instance.configAclKongService(service.kongServiceName, [`${service.kongServiceName}-group`]);
      plugins.push({name: "acl", id: acl.id})
      
      return plugins

    } catch (error) {
      throw new Error("Problem creating Kong")
    }
  }

   public async updateServicePlugins(serviceId: string, pluginType:string, routerOptions: RouterOptions, rateLimitingValue?:string){
    try{
      const pluginRepository = await PostgresPluginRepository.create(await routerOptions.database.getClient());
      const serviceRepository = await PostgresServiceRepository.create(await routerOptions.database.getClient());

      const service = await serviceRepository.getServiceById(serviceId)

      if(pluginType === "rateLimiting"){
        const plugin = await pluginRepository.getPluginByTypeOnService(serviceId, pluginType)

        await RateLimitingPlugin.Instance.removePluginKongService(service.kongServiceName as string, plugin.kongPluginId)
        await pluginRepository.deletePlugin(plugin.id)

        const rateLimiting = await RateLimitingPlugin.Instance.configRateLimitingKongService(service.kongServiceName as string, RateLimitingType.hour, rateLimitingValue as string)
        pluginRepository.createPlugin({
          name: "rateLimiting",
          kongPluginId: rateLimiting.id,
          service: serviceId
        })
        serviceRepository.patchService(serviceId, {rateLimiting: parseInt(rateLimitingValue as string, 10)})
        return rateLimiting
      }

      const plugin = await pluginRepository.getPluginByTypeOnService(serviceId, service.securityType?.toString() as string)
      await Oauth2Plugin.Instance.removePluginKongService(service.kongServiceName as string, plugin.kongPluginId)

      if (pluginType === SECURITY.OAUTH2.toString()) {
        const oauth2 = await Oauth2Plugin.Instance.configureOauth(service.kongServiceName as string);
        await pluginRepository.deletePlugin(plugin.id)
        pluginRepository.createPlugin({
          name: "oauth2",
          kongPluginId: oauth2.id,
          service: serviceId
        })
        serviceRepository.patchService(serviceId, {securityType: pluginType})
        return oauth2
      }  

      const keyauth = await KeyAuthPlugin.Instance.configKeyAuthKongService(service.kongServiceName as string);
      await pluginRepository.deletePlugin(plugin.id)
      pluginRepository.createPlugin({
        name: "key-auth",
        kongPluginId: keyauth.id,
        service: serviceId
      })
      serviceRepository.patchService(serviceId, {securityType: pluginType})
      return keyauth
      
    }
    catch(error){
      throw new Error(`Impossible to update plugin from service ${serviceId}`)
    }

  }

   public async deleteService(serviceId: string, routerOptions: RouterOptions){
    try{
      const pluginRepository = await PostgresPluginRepository.create(await routerOptions.database.getClient());
      const serviceRepository = await PostgresServiceRepository.create(await routerOptions.database.getClient());

      const service = await serviceRepository.getServiceById(serviceId)
      const plugins = await pluginRepository.getPluginByServiceId(serviceId)

      const consumerGroupService = new ConsumerGroupService();
      await consumerGroupService.deleteConsumerGroup(`${service.kongServiceName}-group`)

      plugins.forEach(async p => {
        await AclPlugin.Instance.removePluginKongService(service.kongServiceName as string, p.kongPluginId);
        await pluginRepository.deletePlugin(p.id)
      });


      return plugins
    }
    catch(error){
      throw new Error(`Impossible to delete plugins from service ${serviceId}`)
    }
  }

  /* public async removePlugin(routerOptions: RouterOptions, serviceId: string) {
    const ServiceRepository = await PostgresServiceRepository.create(
      await routerOptions.database.getClient(),
    );
    const PluginRepository = await PostgresPluginRepository.create(
      await routerOptions.database.getClient(),
    );

    let service = await ServiceRepository.getServiceById(serviceId);
    service = Object.values(service)[0];

    service.securityType = SECURITY.NONE;
    const kongServiceId = service.kongServiceId;
    const plugin = await PluginRepository.getPluginByServiceId(
      kongServiceId as string,
    ) as Plugin;
    await AclPlugin.Instance.removePluginKongService(service.kongServiceName as string, plugin.props.pluginId);
    // PluginRepository.deletePlugin(plugin.id);
    ServiceRepository.updateService(serviceId, service as ServiceDto);
  }*/ 

  public async changeToOauth2(routerOptions: RouterOptions, serviceId: string) {
    const ServiceRepository = await PostgresServiceRepository.create(
      await routerOptions.database.getClient(),
    );
    let service = await ServiceRepository.getServiceById(serviceId);
    service = Object.values(service)[0];

    service.securityType = SECURITY.OAUTH2;

    Oauth2Plugin.Instance.configureOauth(service.kongServiceName as string);
    ServiceRepository.updateService(serviceId, service as ServiceDto);
  }

  public async changeStatus(
    routerOptions: RouterOptions,
    serviceId: string,
    status: boolean,
  ) {
    const ServiceRepository = await PostgresServiceRepository.create(
      await routerOptions.database.getClient(),
    );
    let service = await ServiceRepository.getServiceById(serviceId);
    service = Object.values(service)[0];

    service.active = status;
    ServiceRepository.updateService(serviceId, service as ServiceDto);
  }
}
