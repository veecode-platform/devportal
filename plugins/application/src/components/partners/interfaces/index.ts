export interface IPartner {
    id: string, 
    name: string,
    active?:  boolean | null,
    email: string,
    celular: number | string, // to do
    servicesId: string[],
    applicationId: string[],
    createdAt?: string, 
    updatedAt?: string, 
  };

export interface ICreatePartner{
  name: string,
  active?:  boolean | null,
  email: string,
  celular: number | string, // to do
  servicesId: string[] | any,
  applicationId: string[] | any,
}