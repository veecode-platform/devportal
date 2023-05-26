import { getOrgsGithub, getOrgsGitlab } from "./providers";
import { ParamsService } from "./types";

export async function getOrgs(Params : ParamsService): Promise<string[]>{
    switch (Params.provider) {
        case "github":
            return await getOrgsGithub(Params.token)
        case "gitlab":
            return await getOrgsGitlab(Params.token)
        default:
            return ["not orgs avaliable"];
    }
}
