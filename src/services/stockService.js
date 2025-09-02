import API from "./api";

export const addStockItem = (data)=>API.post('/stock/add',data);
export const getStockItems = ()=>API.get('/stock/getAll');
export const getItem = (id)=>API.get(`/stock/getItem/${id}`)
export const updateItem = (id,data)=>API.put(`/stock/edit/${id}`,data);
