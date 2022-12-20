import { Plugin } from '../domain/Plugin';
import { PluginResponseDto } from '../dtos/PluginResponseDto';

export class PluginMapper {
  static async toPersistence(plugin: Plugin) {
    return {
      id: plugin._id,
      name: plugin.props.name,
      active: plugin.props.active,
      service: plugin.props.service,
      createdAt: plugin.props.createdAt,
      updatedAt: plugin.props.updatedAt,
    };
  }
  static async listAllServicesToResource(pluginResponseDto: PluginResponseDto) {
    return {
      plugins: pluginResponseDto.props.plugins ?? [],
      plugin: pluginResponseDto.props.plugin ?? '',
    };
  }
}
