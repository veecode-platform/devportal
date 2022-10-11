import { Entity } from "../../../core/domain/Entity";

export interface DevServiceProps {
  name: string
  description?: string
  kongService: string
  enable?: boolean
  redirectUrl?: string
  creator: string
  createdAt?: Date
  updatedAt?: Date
}
export class DevService extends Entity<DevServiceProps>{
  private constructor(props: DevServiceProps, id?: string) {
    super(props,id)
  }

  static create(props: DevServiceProps, id?: string): DevService {
   return new DevService(props,id)
  }

}