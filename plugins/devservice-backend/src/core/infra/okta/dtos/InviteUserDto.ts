export interface InviteUserDto {
  profile: {
  email:string;
  firstName: string;
  lastName: string;
  }
  groupIds?: string[];
}