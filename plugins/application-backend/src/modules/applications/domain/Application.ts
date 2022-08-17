import { Entity } from '../../../core/domain/Entity';

export type ApplicationProps = {
  creator: string;
  name: string;
  serviceName: string[];
  description: string;
  active?: boolean;
  statusKong?: string;
  createdAt?: Date;
  updatedAt?: Date;
  consumerName?: string[];
}

export class Application extends Entity<ApplicationProps>{
  private constructor(
    props: ApplicationProps,
    id?: string,
  ) {
    super(props,id);
  }
  static create(props: ApplicationProps,id?:string,): Application {
    props.createdAt = props.createdAt || new Date();
    return new Application(props,id);
  }
}
