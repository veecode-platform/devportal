import { Knex } from 'knex';
import { Plugin } from '../../domain/Plugin';
import { PluginDto } from '../../dtos/PluginDto';
import { PluginResponseDto } from '../../dtos/PluginResponseDto';
import { PluginMapper } from '../../mappers/PluginMapper';
import { IPluginRepository } from '../IPluginRepository';

export class PostgresPluginRepository implements IPluginRepository {
  constructor(private readonly db: Knex) { }


  static async create(knex: Knex<any, any[]>): Promise<IPluginRepository> {
    return new PostgresPluginRepository(knex);
  }

  /**
   * Returns an array of plugins from the database
   * @returns {Promise<Plugin[]>}
   */
  async getPlugins(): Promise<Plugin[]> {
    const plugin = await this.db<Plugin>('plugin')
      .select('*')
      .catch(error => console.log(error));
    const pluginDomain = PluginResponseDto.create({ plugins: plugin });
    const responseData = await PluginMapper.listAllPluginsToResource(
      pluginDomain,
    );
    return responseData.plugins ?? [];
  }

  /**
   * Return a plugin by id
   * @returns {Promise<string | Plugin>}
   */
  async getPluginById(id: string): Promise<string | Plugin> {
    const plugin = await this.db<Plugin>('plugin')
      .where('id', id)
      .limit(1)
      .select()
      .catch(error => console.log(error));
    const pluginDomain = PluginResponseDto.create({ pluginIt: plugin });
    const responseData = await PluginMapper.listAllPluginsToResource(
      pluginDomain,
    );
    return responseData.plugin ?? 'cannot find plugin';
  }

  async getPluginByServiceId(serviceId: string): Promise<any[]> {
    try{
      const plugins = await this.db<Plugin>('plugin').where('service', serviceId).select();
      return plugins
    }
    catch(error){
      throw new Error(`impossible to fetch plugins from ${serviceId}`)
    }
  }

  async getPluginByTypeOnService(serviceId: string, type: string): Promise<any>{
    try{
      const plugin = (await this.db<Plugin>('plugin').where('service', serviceId).andWhere('name', type).first());
      return plugin
    }
    catch(error){
      throw new Error(`impossible to fetch plugin from ${serviceId}`)
    }

  }

  /**
   * Save a plugin in database
   * @returns {Promise<Plugin>}
   */
  async savePlugin(pluginDto: PluginDto): Promise<Plugin> {
    const plugin: Plugin = Plugin.create({
      name: pluginDto.name,
      service: pluginDto.service,
      kongPluginId: pluginDto.kongPluginId
    });
    PluginMapper.toPersistence(plugin);
    return plugin;
  }

  /**
   * Delete a plugin
   * @returns {Promise<void>}
   */
  async deletePlugin(id: string): Promise<void> {
    await this.db<Plugin>('plugin')
      .where('id', id)
      .del()
      .catch(error => console.error(error));
  }

  /**
   * Create a plugin
   * @returns {Promise<string | Plugin>}
   */
  async createPlugin(pluginDto: any): Promise<string | Plugin> {
    const plugin: Plugin = Plugin.create({
      name: pluginDto.name,
      service: pluginDto.service,
      kongPluginId: pluginDto.kongPluginId
    });
    const data = await PluginMapper.toPersistence(plugin);
    const createdPlugin = await this.db('plugin')
      .insert(data)
      .catch(error => console.error(error));
    return createdPlugin ? plugin : 'cannot create plugin';
  }

  /**
   * Patch a plugin by id
   * @returns {Promise<string | Plugin>}
   */
  async patchPlugin(
    id: string,
    pluginDto: PluginDto,
  ): Promise<string | Plugin> {
    const plugin: Plugin = Plugin.create({
      name: pluginDto.name,
      service: pluginDto.service,
      kongPluginId: pluginDto.kongPluginId
    });
    const patchedPlugin = await this.db('plugin')
      .where('id', id)
      .update(pluginDto)
      .catch(error => console.log(error));
    return patchedPlugin ? plugin : 'cannot patch plugin';
  }


}
