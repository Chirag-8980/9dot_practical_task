import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../../utils/axiosInterceptor';
import toast from 'react-hot-toast';


export const registerUser = createAsyncThunk('auth/registration', async (userData, thunkAPI) => {
  try {
    const res = await API.post(`auth/registration`, userData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await API.post(`auth/login`, credentials);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data || 'Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
      window.location.href = "/login"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.result;
        localStorage.setItem('token', action.payload.token);
        toast.success(action.payload.message || 'Registration successful');
      })
      .addCase(registerUser.rejected, (state, action) => {
        toast.error(action.payload.error.message || 'Registration failed');
        state.loading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.token);
        state.user = action.payload.result;
        toast.success(action.payload.message || 'Login successful');
      })
      .addCase(loginUser.rejected, (state, action) => {
        toast.error(action.payload.message || 'Login failed');
       state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
