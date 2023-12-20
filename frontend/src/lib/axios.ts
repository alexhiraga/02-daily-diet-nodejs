import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://daily-diet-api-90e5.onrender.com'
        : import.meta.env.BASE_URL_LOCAL,
    withCredentials: true
})