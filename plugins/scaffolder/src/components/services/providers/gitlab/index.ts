import axios from 'axios';
import { ParamsProvider } from '../../types';

export async function getOrgsGitlab(Params : ParamsProvider): Promise<string[]>{

    const { host, token } = Params;

    const GITLAB_ORGS_URL = `https://${host}/api/v4/groups`;

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

export async function getUserGitlab(Params: ParamsProvider): Promise<string>{

    const { host, token } = Params;

    const GITLAB_USER_URL = `https://${host}/api/v4/user`

    const headers = {
        Authorization: `Bearer ${token}`
    }

    try{
        const response = await axios.get( GITLAB_USER_URL ,{ headers });

        if (response.status === 200){
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
