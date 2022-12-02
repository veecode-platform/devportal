export interface IApplication  {
    id: string,
    name: string;
    creator: string;
    servicesId: string[];
    active?: boolean | null;
    kongConsumerName?: string;
    description?: string;
    kongConsumerId?: string;
    createdAt: Date;
    updateAt: Date;
  }

export interface ICreateApp{
  name: string,
  creator: string,
  servicesId: string[],
  kongConsumerName: string,
  kongConsumerId: string,
}

