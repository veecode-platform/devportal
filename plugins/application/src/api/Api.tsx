import axios from 'axios';

const AxiosInstance = axios.create({
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
    }
});
// todo - add custom authorization header based on identity api


export default AxiosInstance;