import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? import.meta.env.BASE_URL_PROD
        : import.meta.env.BASE_URL_LOCAL,
    withCredentials: true
})