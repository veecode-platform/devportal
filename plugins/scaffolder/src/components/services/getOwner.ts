import { getOwnerGithub, getOwnerGitlab } from "./providers";
import { GetOwnerType } from "./types";

export async function getOwner(Params : GetOwnerType): Promise<string> {
    switch (Params.provider) {
        case "github":
            return await getOwnerGithub(Params.token)
        case "gitlab":
            return await getOwnerGitlab(Params.token)
        default:
            return "Not Owner avaliable";
    }
}
