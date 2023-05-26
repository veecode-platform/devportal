import { getOrgsGithub, getOrgsGitlab, getUserGithub, getUserGitlab } from "./providers";
import { ParamsService, ResponseService } from "./types";

export async function getUserAndOrgs(Params : ParamsService): Promise<ResponseService> {
    switch (Params.provider) {
        case "github":
            const user_github = await getUserGithub(Params.token);
            const orgs_github = await getOrgsGithub(Params.token);
            return { username: user_github, organizations: orgs_github}
        case "gitlab":
            const user_gitlab = await getUserGitlab(Params.token);
            const orgs_gitlab = await getOrgsGitlab(Params.token);
            return { username: user_gitlab, organizations: orgs_gitlab}
        default:
            return { username: "Not Found", organizations: ["Not Found"]}
    }
}
