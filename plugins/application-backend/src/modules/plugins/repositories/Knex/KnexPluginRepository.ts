import { Plugin } from '../../domain/Plugin';
import { PluginDto } from '../../dtos/PluginDto';
import { IPluginRepository } from '../IPluginRepository';
import { Knex } from 'knex';

export class PostgresPluginRepository implements IPluginRepository {
  constructor(private readonly db: Knex) {}

  static async create(knex: Knex<any, any[]>): Promise<IPluginRepository> {
    return new PostgresPluginRepository(knex);
  }

  getPlugins(): Promise<Plugin[]> {
    throw new Error('Method not implemented.');
  }
  getPluginById(id: string): Promise<string | Plugin> {
    throw new Error('Method not implemented.');
  }
  savePlugin(pluginDto: PluginDto): Promise<Plugin> {
    throw new Error('Method not implemented.');
  }
  deletePlugin(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  createPlugin(pluginDto: PluginDto): Promise<string | Plugin> {
    throw new Error('Method not implemented.');
  }
  patchPlugin(id: string, pluginDto: PluginDto): Promise<string | Plugin> {
    throw new Error('Method not implemented.');
  }
}
