import { Entity } from '../../../core/domain/Entity';

export type UserProps = {
    id?:string;
    enabled: Boolean;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Entity<UserProps>{
  private constructor(
    props: UserProps,
    id?: string,
  ) {
    super(props,id);
  }
  static create(props: UserProps,id?:string): User {
    props.createdAt = props.createdAt || new Date();
    return new User(props,id);
  }
}
