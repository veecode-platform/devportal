import { Entity } from '../../../core/domain/Entity';

export type ApplicationProps = {
  name: string;
  creator: string;
  parternId: string;
  servicesId: string[];
  active?: boolean;
  externalId?: string;
  createdAt?: Date;
  updateAt?: Date;
};

export class Application extends Entity<ApplicationProps> {
  name?: string;
  creator?: string;
  parternId?: string;
  servicesId?: string[];
  active?: boolean;
  externalId?: string;
  createdAt?: Date;
  updateAt?: Date;
  private constructor(props: ApplicationProps, id?: string) {
    super(props, id);
  }
  static create(props: ApplicationProps, id?: string): Application {
    props.createdAt = props.createdAt || new Date();
    return new Application(props, id);
  }
}
