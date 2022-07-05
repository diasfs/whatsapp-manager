import axios from 'axios';
import SessionStorage from './session-storage';
import router from '~/router.js';

let baseURL;
if (import.meta.env.DEV) {
    baseURL = `${import.meta.env.VITE_API_ENDPOINT}`
} else {
    baseURL = `${location.origin}/api`
}

 
export const api = axios.create({
    baseURL
});

api.interceptors.request.use(config => {
    const access_token = SessionStorage.getItem('access_token');
    if (access_token) {
        config.headers['Authorization'] = `Bearer ${access_token}`
    }

    return config;
});

api.interceptors.response.use(response => {
    return response
}, error => {
    if (error && error.response && error.response.status == 401) {
        SessionStorage.removeItem('access_token');
        router.replace('/');
    }
    return Promise.reject(error);
})


export default api;