import axios from 'axios';
import config from '../config';

const {
    apiBackend: URL
} = config;

export const API_BACKEND = axios.create({
    baseURL: `${URL}`
});
