export interface IService {
  id: string,
  name: string,
  active?:  boolean | null,
  description: string,
  redirectUrl: string,
  partnersId: string[],
  kongServiceName: string,
  kongServiceId: string,
  rateLimiting: number,
  createdAt: Date | string,
  updatedAt: Date | string
}

export interface ICreateService{
    name: string,
    creator: string,
    active: boolean | null;
    servicesId: string[],
    rateLimiting: number,
    kongConsumerName: string,
    kongConsumerId: string,
}

export interface IPartner {
  id: string;
  name: string;
  email: string;
  celular: string;
  servicesId: string[];
}

