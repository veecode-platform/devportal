import { getOrgsGithub, getOrgsGitlab } from "./providers";
import { GetOrgsType } from "./types";

export async function getOrgs(Params : GetOrgsType): Promise<string[]>{
    switch (Params.provider) {
        case "github":
            return await getOrgsGithub(Params.token)
        case "gitlab":
            return await getOrgsGitlab(Params.token)
        default:
            return ["not orgs avaliable"];
    }
}
