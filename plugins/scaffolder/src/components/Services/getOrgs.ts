import { getOrgsGithub, getOrgsGitlab } from "./providers";
import { GetOrgsType } from "./types";

export async function getOrgs(Params : GetOrgsType) {
    switch (Params.provider) {
        case 'github':
            await getOrgsGithub(Params.token)
            break;
        case 'gitlab':
            await getOrgsGitlab(Params.token)
            break;
        default:
            break;
    }
}
