import API from "./api";

export const addInitialData = (data)=>API.post('/attendance/addInitial',data);
export const getAllAttendance = ()=>API.get('/attendance/getAll');