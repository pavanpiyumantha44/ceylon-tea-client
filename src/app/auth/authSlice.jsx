import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user:null,
    token:null,
    isAuthnticated:null
} 

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            const {user, token} = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthnticated = true;
            localStorage.setItem('auth', JSON.stringify({ user, token }));
        },
        logout:(state,action)=>{
            state.user=null,
            state.token=null,
            state.isAuthnticated = false;
            localStorage.removeItem('auth');
        }
    }
})
export const {setCredentials,logout} = authSlice.actions;
export default authSlice.reducer;