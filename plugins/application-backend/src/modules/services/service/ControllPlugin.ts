import { PluginDatabaseManager } from '@backstage/backend-common';
import { ConsumerGroup } from '../../kong/model/ConsumerGroup';
import { AclPlugin } from '../../kong/plugins/AclPlugin';
import { KeyAuthPlugin } from '../../kong/plugins/KeyAuthPlugin';
import { Oauth2Plugin } from '../../kong/plugins/Oauth2Plugin';
import { ConsumerGroupService } from '../../kong/services/ConsumerGroupService';
import { Plugin } from '../../plugins/domain/Plugin';
import { PostgresPluginRepository } from '../../plugins/repositories/Knex/KnexPluginRepository';
import { SECURITY } from '../domain/Service';
import { ServiceDto } from '../dtos/ServiceDto';
import { PostgresServiceRepository } from '../repositories/Knex/KnexServiceReppository';

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
    const consumerGroupService = new ConsumerGroupService();
    try {
      if (service.securityType?.toString() == SECURITY.OAUTH2.toString()) {
        await Oauth2Plugin.Instance.configureOauth(service.kongServiceName);
        const consumerGroup: ConsumerGroup = new ConsumerGroup(
          service.kongServiceName + '-group',
        );
        await consumerGroupService.createConsumerGroup(consumerGroup);
        await AclPlugin.Instance.configAclKongService(service.kongServiceName, [
          `${service.kongServiceName + '-group'}`,
        ]);
      } else if (
        service.securityType?.toString() == SECURITY.KEY_AUTH.toString()
      ) {
    
        await KeyAuthPlugin.Instance.configKeyAuthKongService(
          service.kongServiceName,
        );
        const consumerGroup: ConsumerGroup = new ConsumerGroup(
          service.kongServiceName + '-group',
        );
        await consumerGroupService.createConsumerGroup(consumerGroup);
        await AclPlugin.Instance.configAclKongService(service.kongServiceName, [
          `${service.kongServiceName + '-group'}`,
        ]);
      }
    } catch (error) {
     return error;
    }
  }

  public async removePlugin(routerOptions: RouterOptions, serviceId: string) {
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
  }

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
