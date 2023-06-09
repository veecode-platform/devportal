import { getOrgsGithub, getOrgsGitlab } from "./providers";
import { ParamsService } from "./types";

export async function getOrgs(Params : ParamsService): Promise<string[]>{

    const {provider , host , token } = Params;

    switch (provider) {
        case "github":
            return await getOrgsGithub({host, token})
        case "gitlab":
            return await getOrgsGitlab({host, token})
        default:
            return ["not orgs avaliable"];
    }
}
