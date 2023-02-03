import axios from "axios";
import { KongServiceBase } from "./KongServiceBase";

export class CredentialsOauth extends KongServiceBase{

    public async generateCredentials(idConsumer: string, name: string){
        const url =  `${await this.getUrl()}/default/consumers/${idConsumer}/oauth2`
        const response = await axios.post(url, {
            name: name
        });
        console.log(response.data);
        return response.data;
    }

    public async findAllCredentials(idConsumer: string){
        const url =  `${await this.getUrl()}/default/consumers/${idConsumer}/oauth2`
        const response = await axios.get(url);
        return response.data;
    }
    public async deleteCredentialById(idConsumer: string, idCredential: string){
        const url =  `${await this.getUrl()}/default/consumers/${idConsumer}/oauth2/${idCredential}`
        const response = await axios.delete(url);
        return response.data;
   
    }   

}