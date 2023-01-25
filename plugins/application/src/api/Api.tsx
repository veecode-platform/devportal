import axios from 'axios';

const AxiosInstance = axios.create({
    baseURL: 'http://localhost:7007/api/devportal',
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
    }
});
// todo - add custom authorization header based on identity api


export default AxiosInstance;