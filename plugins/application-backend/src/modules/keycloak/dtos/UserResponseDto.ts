import { User } from "../domain/User";
import { ResponseEntity } from "../../../core/domain/ResponseEntity";

type ResponseProps = {
  users?: User[] | void;
  userIt?: User[] | void;
  user?: User | void;
}
export class UserResponseDto extends ResponseEntity<ResponseProps> {
  private constructor(props: ResponseProps) {
    super(props);
  }
  static create(props: ResponseProps): UserResponseDto {
    props.user = props.userIt?.length && props.userIt?.[0] || props.user
    return new UserResponseDto(props);
  }
}