import { groupName } from "../../providers/types";

export class GroupUtils {
   static async extractIdByGroupName(oktaGroups: any[]): Promise<string>{
    const groupMatched = oktaGroups.find((group) => group.profile.name.includes(groupName));
    return  groupMatched.id ? groupMatched.id : 'Not found group';
  }
} 