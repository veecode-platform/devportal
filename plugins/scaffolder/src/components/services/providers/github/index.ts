import axios from "axios";

const GITHUB_ORGS_URL = "https://api.github.com/user/orgs";
const GITHUB_USER_URL = "https://api.github.com/user"

export async function getOrgsGithub(token:string): Promise<string[]>{
    const headers = {
        Authorization: `Bearer ${token}`
    }
    const orgsList = [];

    try{
        const response = await axios.get( GITHUB_ORGS_URL ,{ headers });

        if (response.status === 200){
            const orgs = response.data;
            for( const org of orgs){
                orgsList.push(org.login as string);
            }
            return orgsList
        }
        else {
            console.log('Error');
            orgsList.push("Not orgs");
            return orgsList;
        }
    }
    catch(error){
        console.log('Error');
        orgsList.push("Not orgs");
        return orgsList;
    }
}

export async function getUserGithub(token:string): Promise<string>{
    const headers = {
        Authorization: `token ${token}`
    }

    try{
        const response = await axios.get( GITHUB_USER_URL ,{ headers });

        if (response.status === 200){
            const owner = response.data.login;
            return owner
        }
        else {
            console.log('Error');
            return "not found";
        }
    }
    catch(error){
        console.log('Error');
        return "not found"
    }
}
