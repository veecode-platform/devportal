import { Entity } from '../../../core/domain/Entity';

export type ApplicationProps = {
  name: string;
  creator: string;
  servicesId: string[];
  active: boolean;
  kongConsumerName: string;
  kongConsumerId: string;
  createdAt: Date;
  updateAt: Date;

}

export class Application extends Entity<ApplicationProps>{
  private constructor(
    props: ApplicationProps,
    id?: string,
  ) {
    super(props,id);
  }
  static create(props: ApplicationProps,id?:string): Application {
    props.createdAt = props.createdAt || new Date();
    return new Application(props,id);
  }
}
