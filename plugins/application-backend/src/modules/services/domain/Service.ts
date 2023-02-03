import { Entity } from '../../../core/domain/Entity';

export type ServiceProps = {
  name: string;
  description: string;
  redirectUrl: string;
  partnersId?: string[];
  active: boolean;
  kongServiceName: string;
  kongServiceId: string;
  rateLimiting: number;
  createdAt?: Date;
  updatedAt?: Date;
  securityType: SECURITY;
};

export class Service extends Entity<ServiceProps> {
  name?: string;
  description?: string;
  redirectUrl?: string;
  partnersId?: string[];
  active?: boolean;
  kongServiceName?: string;
  kongServiceId?: string;
  rateLimiting?: number;
  createdAt?: Date;
  updatedAt?: Date;
  securityType?: SECURITY;
  private constructor(props: ServiceProps, id?: string) {
    super(props, id);
  }
  static create(props: ServiceProps, id?: string): Service {
    props.createdAt = props.createdAt || new Date();
    return new Service(props, id);
  }
}
export enum SECURITY {
  KEY_AUTH = 'key-auth',
  OAUTH2= 'oauth2',
  NONE= 'none'
}
