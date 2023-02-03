import { Entity } from '../../../core/domain/Entity';

export type PartnerProps = {
  name: string;
  email: string;
  active: boolean;
  phone: string;
  servicesId: string[];
  applicationId: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class Partner extends Entity<PartnerProps> {
  name?: string;
  email?: string;
  active?: boolean;
  phone?: string;
  servicesId?: string[];
  applicationId?: string[];
  private constructor(props: PartnerProps, id?: string) {
    super(props, id);
  }
  static create(props: PartnerProps, id?: string): Partner {
    props.createdAt = props.createdAt || new Date();
    return new Partner(props, id);
  }
}
