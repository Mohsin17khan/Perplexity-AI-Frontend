import { configureStore } from '@reduxjs/toolkit';
import authReducer  from '../auth/auth.slice';
import chatReducer from '../chat/chat.slice'


export const store = configureStore({
    reducer:{
        auth:authReducer,
        chat:chatReducer
    }

})