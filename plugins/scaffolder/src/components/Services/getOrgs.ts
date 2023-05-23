import { getOrgsGithub, getOrgsGitlab } from "./providers";
import { GetOrgsType } from "./types";
import { Providers } from './enum/providers'

export async function getOrgs(Params : GetOrgsType) {
    switch (Params.provider) {
        case Providers.github:
            await getOrgsGithub(Params.token)
            break;
        case Providers.gitlab:
            await getOrgsGitlab(Params.token)
            break;
        default:
            break;
    }
}
