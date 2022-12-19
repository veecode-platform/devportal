import { Entity } from '../../../core/domain/Entity';

export type ServiceProps = {
  name: string;
  description: string;
  redirectUrl: string;
  partnersId: string[];
  kongServiceName: string;
  kongServiceId: string;
  createdAt?: Date;
  updatedAt?: Date;
  securityPlugin: SECURITY;
}

export class Service extends Entity<ServiceProps>{
  private constructor(
    props: ServiceProps,
    id?: string,
  ) {
    super(props,id);
  }
  static create(props: ServiceProps,id?:string): Service {
    props.createdAt = props.createdAt || new Date();
    return new Service(props,id);
  }
}
export enum SECURITY{
  ACL = 'acl',
  KEYAUTH = 'key-auth',
  OAUTH2= 'oauth2'
}
