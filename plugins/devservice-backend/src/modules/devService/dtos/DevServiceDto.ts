export interface DevServiceDto {
  creator:string;
  name:string;
  kongService:string;
  description:string;
  enable?:boolean;
  redirectUrl?:string;
  createdAt?:Date;
  updatedAt?:Date;
  consumerName?:string[];
}