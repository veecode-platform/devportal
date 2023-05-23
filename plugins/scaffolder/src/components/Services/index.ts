import { getOrgsGithub, getOrgsGitlab } from "./providers";
import { GetOrgsType } from "./types";

export default async function getOrgs(Params : GetOrgsType) {
    switch (Params.provider) {
        case 'github':
            getOrgsGithub(Params.token)
            break;
        case 'gitlab':
            getOrgsGitlab(Params.token)
            break;
        default:
            break;
    }
}
