import API from "./api";

export const addPerson = (data)=>API.post('/person/add',data);
export const getRoles = ()=>API.get('/person/getRoles');
export const personCount = ()=>API.get('/person/getPersonCount');
export const allWorkers = ()=>API.get('/person/getAllPerson');
export const deleteWorker = (id)=>API.delete(`/person/deletePerson/${id}`);
export const allSupervisors = ()=>API.get('/person/getAllSupervisors');
export const allAvilableWorkers = ()=>API.get('/person/getAllWorkers');
export const allTeaPluckers = ()=>API.get('/person/getAllTeaPluckers');