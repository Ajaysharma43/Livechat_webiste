import axios from "axios";

export const GetFileInstance = axios.create({
    baseURL : `${import.meta.env.VITE_API_URL}/Upload`
})