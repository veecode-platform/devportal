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
            // lançar um erro  --- ver se vou retornar um array vazio ou disparar um erro
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

export async function getOwnerGitlab(token:string): Promise<string>{
    const headers = {
        Authorization: `PRIVATE-TOKEN ${token}`
    }

    try{
        const response = await axios.get( GITLAB_USER_URL ,{ headers });

        if (response.status === 200){
            const owner = response.data.username;
            return owner
        }
        else {
            // lançar um erro  --- ver se vou retornar um array vazio ou disparar um erro
            console.log('Error');
            return "not found";
        }
    }
    catch(error){
        console.log('Error');
        return "not found"
    }
}