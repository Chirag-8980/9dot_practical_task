import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../utils/axiosInterceptor";
import toast from "react-hot-toast";

export const getTasks = createAsyncThunk(
  "task/getTasks",
  async ({search  , status}, thunkAPI) => {
    try {
      const res = await API.get(`task`, {
        params : {
        search , status
        }
      });
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
      const res = await API.post(`task`, taskData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data || "Failed to add task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, thunkAPI) => {
    try {
      const res = await API.delete(`task/${taskId}`);
      toast.success("Task Deleted Successfull")
      return taskId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data || "Failed to add task"
      );
    }
  }
);


export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData, thunkAPI) => {
    try {
      const res = await API.put(`task/${taskData._id}`, taskData);
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
      type : null
    },
  },
  reducers: {
    setModel: (state, action) => {
      console.log(action);
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
      .addCase(getTasks.rejected, (state, action) => {
        toast.error(action.payload.error.message || "Failed to fetch tasks");
        state.loading = false;
      })


      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload.data);
        state.model = {isOpen : false , data : null}
        toast.success(action.payload.message || "Task added successfully");
      })
      .addCase(addTask.rejected, (state, action) => {
        toast.error(action.payload.error.message || "Failed to add task");
        state.loading = false;
      })


        .addCase(deleteTask.fulfilled, (state, action) => {
          state.loading = false;
          console.log("action.payload.data-->" , action.payload.data);
          state.tasks = state.tasks.filter((task) => task._id !== action.payload);
          toast.success(action.payload.message || "Task deleted successfully");
        })
        .addCase(deleteTask.rejected, (state, action) => {
          toast.error(action.payload.error.message || "Failed to delete task");
          state.loading = false;
        })


      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload.data._id ? action.payload.data : task
        );
        state.model = {isOpen : false , data : null}
        toast.success(action.payload.message || "Task updated successfully");
      })
      .addCase(updateTask.rejected, (state, action) => {
        toast.error(action.payload.error.message || "Failed to update task");
        state.loading = false;
      });
  },
});

export const { setModel } = taskSlice.actions;
export default taskSlice.reducer;
