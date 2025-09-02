import {configureStore} from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'

const persistedAuth = localStorage.getItem('auth')
  ? JSON.parse(localStorage.getItem('auth'))
  : null;

const preloadedState = {
  auth: {
    user: persistedAuth?.user || null,
    token: persistedAuth?.token || null,
    isAuthenticated: persistedAuth ? true : false,
  },
};


export const store = configureStore({
    reducer:{
        auth:authReducer,
    },
    preloadedState
})