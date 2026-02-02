import axios from "axios";

const baseUrl = "https://localhost:7031/api/";

export const Api = axios.create({
    baseURL : baseUrl,
    withCredentials : true,
    headers: {"Content-Type" : "application/json"}
})

export default Api;