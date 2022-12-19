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
    serviceId: string,
    name: string,
    active: boolean | null;
    description: string,
    security: string,
    rateLimiting: number,
}

export interface IPartner {
  id: string;
  name: string;
  email: string;
  celular: string;
  servicesId: string[];
}

export interface IKongServices {
  id: string;
  name: string;
}


