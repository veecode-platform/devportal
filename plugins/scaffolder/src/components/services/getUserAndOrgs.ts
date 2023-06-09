import { getOrgsGithub, getOrgsGitlab, getUserGithub, getUserGitlab } from "./providers";
import { ParamsService, ResponseService } from "./types";

export async function getUserAndOrgs(Params : ParamsService): Promise<ResponseService> {

    const {provider , host , token } = Params;

    switch (provider) {
        case "github":
            const user_github = await getUserGithub({host, token});
            const orgs_github = await getOrgsGithub({host, token});
            return { username: user_github, organizations: orgs_github}
        case "gitlab":
            const user_gitlab = await getUserGitlab({host, token});
            const orgs_gitlab = await getOrgsGitlab({host, token});
            return { username: user_gitlab, organizations: orgs_gitlab}
        default:
            return { username: "Not Found", organizations: ["Not Found"]}
    }
}
