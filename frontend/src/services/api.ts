import axios from "axios";
import { getToken, login } from "./auth";


const api = axios.create({
    baseURL: 'http://localhost:3000/',
});

api.interceptors.request.use(async config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(async config => {
    if (config.headers.token) {
        login(config.headers.token);
    }
    return config;
});

export default api;