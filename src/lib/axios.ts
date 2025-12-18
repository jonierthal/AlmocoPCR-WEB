import axios from "axios";

const baseURL =
    import.meta.env.VITE_API_BASE_URL ?? "https://appalmoco-pcr.azurewebsites.net/";

export const api = axios.create({
    baseURL,
});