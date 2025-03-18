import axios from "axios";

export const UploadFileInstance  = axios.create({
    baseURL : `${import.meta.env.VITE_API_URL}/Upload`
})