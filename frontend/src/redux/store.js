import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../redux/slice/authSlice.js'; 
import taskSlice from '../redux/slice/taskSlice.js';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: taskSlice,
  },
});
