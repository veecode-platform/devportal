import { getUserGithub, getUserGitlab } from "./providers";
import { ParamsService } from "./types";

export async function getUser(Params : ParamsService): Promise<string> {
    switch (Params.provider) {
        case "github":
            return await getUserGithub(Params.token)
        case "gitlab":
            return await getUserGitlab(Params.token)
        default:
            return "Not Owner avaliable";
    }
}
