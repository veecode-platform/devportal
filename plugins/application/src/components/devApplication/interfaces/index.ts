export interface IApplication  {
    id: string,
    creator: string,
    name: string,
    serviceName: string[],
    active: boolean | null,
    description?:string,           // check prop
    statusKong?: string,           // check prop
    consumerName?: string,         // check prop
    url:string,
    createdAt: string,
    updateAt: string
  }
export interface ICreateApp{
  name: string,
  creator: string,
  url: string,
  description: string,
  serviceName: string[],
}

