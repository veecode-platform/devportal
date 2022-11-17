import { Entity } from "../../../domain/Entity";

export interface ProviderUserProps{
  oktaId: string;
  profile: {
  email:string;
  firstName: string;
  lastName: string;
  }
}

export class ProviderUser extends Entity<ProviderUserProps>{

 private constructor(props: ProviderUserProps, id?: string,)
  {
  super(props,id);
  }
  create(props:ProviderUserProps,id:string) : ProviderUser {
    return new ProviderUser(props,id);
  }
}

