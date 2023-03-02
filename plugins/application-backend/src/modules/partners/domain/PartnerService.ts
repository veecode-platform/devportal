import { Entity } from "../../../core/domain/Entity";

export type PartnerServiceProps = {
  
    partner_id: number;
    service_id: number;
};

export class PartnerService extends Entity<PartnerServiceProps>{
    partner_id?: number;
    service_id?: number;
    

    private constructor(props: PartnerServiceProps, id?: string) {
        super(props, id);
      }
      static create(props: PartnerServiceProps, id?: string): PartnerService {
        return new PartnerService(props, id);
      }

}
