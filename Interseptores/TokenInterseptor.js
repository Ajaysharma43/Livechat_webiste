import axios from "axios";

const Token = sessionStorage.getItem('AccessToken')

export const TokenInstance = axios.create({
    baseURL : `${import.meta.env.VITE_API_URL}/verify`
})

TokenInstance.interceptors.request.use(
    (config) => {
        const AccessToken = sessionStorage.getItem("AccessToken");
            config.headers["Authorization"] = `Bearer ${AccessToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);