import { Entity } from "../../../core/domain/Entity";

export interface UserProps {
  name?: string
  email:string
  active?: boolean
  createdAt?: Date
  updatedAt?: Date
}
export class User extends Entity<UserProps>{
  private constructor( props : UserProps,id? : string ){
    super(props,id)
  }

  create( props : UserProps, id? : string ) : User {
   return new User(props,id)
  }

}