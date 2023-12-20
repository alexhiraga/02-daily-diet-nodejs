import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_BASE_URL_PROD
        : import.meta.env.VITE_BASE_URL_LOCAL,
    withCredentials: true
})