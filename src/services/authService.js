import API from "./api";

export const login = (credentials)=>API.post('/auth/login',credentials);