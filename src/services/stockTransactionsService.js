import API from "./api";

export const getTransactions = ()=>API.get('/stockTransactions/getAll');