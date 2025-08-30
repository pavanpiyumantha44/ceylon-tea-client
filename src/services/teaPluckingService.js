import API from "./api";

export const addSingleTeaPlucking = (data)=>API.post('/teaPlucking/addSingle',data);
export const addBulkTeaPlucking = (data)=>API.post('/teaPlucking/addBulk',data);
export const getTeaRecords = ()=>API.get('/teaPlucking/getAll');
// export const personCount = ()=>API.get('/person/getPersonCount');
// export const allWorkers = ()=>API.get('/person/getAllPerson');
// export const deleteWorker = (id)=>API.delete(`/person/deletePerson/${id}`);
// export const allSupervisors = ()=>API.get('/person/getAllSupervisors');
// export const allAvilableWorkers = ()=>API.get('/person/getAllWorkers');
// export const allTeaPluckers = ()=>API.get('/person/getAllTeaPluckers');