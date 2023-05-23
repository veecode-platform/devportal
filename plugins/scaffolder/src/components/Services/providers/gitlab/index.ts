import axios from 'axios';

const GITLAB_URL = "https://gitlab.com/api/v4/groups";

export async function getOrgsGitlab(token:string): Promise<string[] | undefined>{
    const headers = {
        'Private-Token': token
    }
    const orgsList = [];

    try{
        const response = await axios.get( GITLAB_URL ,{ headers });

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
