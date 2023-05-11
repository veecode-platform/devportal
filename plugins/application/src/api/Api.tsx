import axios from 'axios';
// import { useApi, configApiRef } from '@backstage/core-plugin-api';

const AxiosInstance = axios.create({
    //baseURL: 'http://localhost:7007/api/devportal',// 'https://devportal.platform.vee.codes/api/devportal'
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
    }
});

// AxiosInstance.interceptors.request.use((response)=>{  TODO
//     const backendBaseUrl = useApi(configApiRef).getString("backend.baseUrl") 
//     response.baseURL = `${backendBaseUrl}api/devportal`
//     return response
// })
// todo - add custom authorization header based on identity api


export default AxiosInstance;