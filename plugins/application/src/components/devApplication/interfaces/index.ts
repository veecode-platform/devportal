export interface IApplication  {
    id: string,
    name: string;
    creator: string;
    servicesId: string[];
    active?: boolean | null;
    kongConsumerName?: string;
    description?: string;
    kongConsumerId?: string;
    createdAt: Date | string;
    updateAt: Date | string;
  }

export interface ICreateApplication{
  name: string,
  creator: string,
  servicesId: string[],
  kongConsumerName: string,
  kongConsumerId: string,
}

