import { getUserGithub, getUserGitlab } from "./providers";
import { ParamsService } from "./types";

export async function getUser(Params : ParamsService): Promise<string> {

    const {provider , host , token } = Params;

    switch (provider) {
        case "github":
            return await getUserGithub({host, token})
        case "gitlab":
            return await getUserGitlab({host, token})
        default:
            return "Not Owner avaliable";
    }
}
