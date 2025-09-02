import API from "./api";

export const allTasks = ()=>API.get('/tasks/getAllTasks');
export const addNewTask = (data)=>API.post('/tasks/newTask',data);
export const updateTaskStatus = (id,data)=>API.put(`/tasks/updateStatus/${id}`,{data})
export const getTask = (id)=>API.get(`/tasks/getTask/${id}`);
export const updateTask = (id,data)=>API.put(`/tasks/edit/${id}`,data);
// export const getTeam = (id)=>API.get(`/teams/getTeam/${id}`)
// export const createTeam = (data)=>API.post('/teams/add',data);
// export const removeTeam = (id)=>API.put(`/teams/delete/${id}`);
// export const workersWithoutTeams = ()=>API.get('teams/withoutTeams');
// export const deleteTeamMember = (data)=>API.delete(`/teams/deleteTeamMember`,{data:data});
export const updateTeam = (id,data)=>API.put(`/task/edit/${id}`,data);