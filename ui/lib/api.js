import axios from 'axios';
import SessionStorage from './session-storage';

export const api = axios.create({
    baseURL: `/api`
});

api.interceptors.request.use(config => {
    const access_token = SessionStorage.getItem('access_token');
    if (access_token) {
        config.headers['Authorization'] = `Bearer ${access_token}`
    }

    return config;
});


export default api;