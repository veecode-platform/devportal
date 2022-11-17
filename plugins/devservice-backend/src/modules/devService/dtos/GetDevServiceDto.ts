import { User } from "../../user/domain/User";
import { DevService } from "../domain/DevService";

export interface GetDevServiceDto {
devService:DevService;
users: User[];
}