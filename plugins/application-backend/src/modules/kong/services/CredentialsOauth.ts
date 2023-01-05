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

}