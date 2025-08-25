import API from "./api";

export const allTeams = ()=>API.get('/teams/getAllTeams');
export const addTeamMember = (data)=>API.post('/teams/newTeamMember',data);
export const getTeamMembersInfo = (id)=>API.get(`/teams/getTeamMembers/${id}`);
export const getTeam = (id)=>API.get(`/teams/getTeam/${id}`)
export const createTeam = (data)=>API.post('/teams/add',data);
export const removeTeam = (id)=>API.put(`/teams/delete/${id}`);
export const workersWithoutTeams = ()=>API.get('teams/withoutTeams');
export const deleteTeamMember = (data)=>API.delete(`/teams/deleteTeamMember`,{data:data});
export const updateTeam = (id,description)=>API.put(`/teams/edit/${id}`,{description});