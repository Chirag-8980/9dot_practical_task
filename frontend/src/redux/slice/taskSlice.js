import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../utils/axiosInterceptor";
import toast from "react-hot-toast";

export const getTasks = createAsyncThunk(
  "task/getTasks",
  async (_, thunkAPI) => {
    try {
      const res = await API.get(`task`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data || "Failed to fetch tasks"
      );
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, thunkAPI) => {
    try {
      const res = await API.post(`tasks`, taskData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data || "Failed to add task"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    total : 0,
    loading: false,
    model: {
      isOpen: false,
      data: null,
    },
  },
  reducers: {
    setModel: (state, action) => {
      state.model = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data.tasks;
        state.total = action.payload.data.total;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload.result);
        toast.success(action.payload.message || "Task added successfully");
      })
      .addCase(addTask.rejected, (state, action) => {
        toast.error(action.payload.error.message || "Failed to add task");
        state.loading = false;
      })
      .addCase(getTasks.rejected, (state, action) => {
        toast.error(action.payload.error.message || "Failed to fetch tasks");
        state.loading = false;
      });
  },
});

export const { setModel } = taskSlice.actions;
export default taskSlice.reducer;
