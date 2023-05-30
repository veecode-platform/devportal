import axios from 'axios';

const GITLAB_ORGS_URL = "https://gitlab.com/api/v4/groups";
const GITLAB_USER_URL = "https://gitlab.com/api/v4/user"

export async function getOrgsGitlab(token:string): Promise<string[]>{
    const headers = {
        'Private-Token': token
    }
    const orgsList = [];

    try{
        const response = await axios.get( GITLAB_ORGS_URL ,{ headers });

        if (response.status === 200){
            const orgs = response.data;
            for( const org of orgs){
                orgsList.push(org.name as string);
            }
            return orgsList;
        }
        else {
            console.log('Error');
            orgsList.push("Not Orgs");
            return orgsList;
        }
    }
    catch(error){
        console.log('Error');
        orgsList.push("Not Orgs");
        return orgsList;
    }
}

export async function getUserGitlab(token:string): Promise<string>{
    const headers = {
        Authorization: `Bearer ${token}`
    }

    try{
        const response = await axios.get( GITLAB_USER_URL ,{ headers });

        if (response.status === 200){
            console.log("data vindo do scaffolder", response);
            const owner = response.data.username;
            return owner
        }
        else {
            console.log('Error');
            return "Not found";
        }
    }
    catch(error){
        console.log('Error');
        return "Not found"
    }
}
