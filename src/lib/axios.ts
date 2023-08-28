import axios from "axios";

export const api = axios.create({
    baseURL: 'https://appalmoco-pcr.azurewebsites.net/'
})