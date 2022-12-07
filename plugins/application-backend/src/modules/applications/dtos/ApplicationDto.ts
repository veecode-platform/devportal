export class ApplicationDto {


  name: string;
  creator: string;
  servicesId: string[];
  kongConsumerName: string;
  kongConsumerId: string;
  createdAt: Date;
  updateAt: Date;


  constructor(
    name: string,
    creator: string,
    servicesId: string[],
    kongConsumerName: string,
    kongConsumerId: string,
    createdAt: Date,
    updateAt: Date,
  ) {
    this.name = name
    this.creator = creator
    this.servicesId = servicesId
    this.kongConsumerName = kongConsumerName
    this.kongConsumerId = kongConsumerId
    this.createdAt = createdAt
    this.updateAt = updateAt
  }
}
// kong consumer class
// export type Consumer = {
//   id: string;
//   username: string;
//   custom_id: string;
//   created_at: Date;
//   updated_at: Date;
// }
