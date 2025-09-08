import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";
import { getUserFromLocalStorage, addUserToLocalStorage, removeUserFromLocalStorage } from "../../utils/localStorage";
import { loginUserThunk, registerUserThunk, UpdateUserThunk } from "./userThunk";

const initialState ={
    isLoading: false,
    isSidebarOpen:false,
    user: getUserFromLocalStorage(),
};



export const registerUser = createAsyncThunk('user/registerUser', async (user, thunkAPI)=>{
   
        return registerUserThunk('/auth/register', user, thunkAPI);       
});

export const loginUser = createAsyncThunk('user/loginUser', async (user, thunkAPI)=>{
    return loginUserThunk('/auth/register', user, thunkAPI);
});

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async(user, thunkAPI)=>{
       return UpdateUserThunk('/auth/updateUser', user, thunkAPI);
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        toggleSidebar: (state)=>{
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        logoutUser: (state)=>{
            state.user = null;
            state.isSidebarOpen = false;
            removeUserFromLocalStorage();
        }
    },
    extraReducers:(builder) =>{
        builder
        //Register User
    .addCase(registerUser.pending,  (state) =>{
            state.isLoading = true;
        })
        .addCase(registerUser.fulfilled, (state, {payload}) =>{
            const {user} = payload;
            state.isLoading = false;
            state.user = user;
            addUserToLocalStorage(user);
            toast.success(`Hello There ${user.name}`)
        })
        .addCase(registerUser.rejected, (state, {payload}) =>{
            state.isLoading = false;
            toast.error(payload);
        })
        //Login User
        .addCase(loginUser.pending, (state) =>{
            state.isLoading = true;
        })
        .addCase(loginUser.fulfilled, (state, {payload}) =>{
            const {user} = payload;
            state.isLoading = false;
            state.user = user;
            addUserToLocalStorage(user);
            toast.success(`Welcome Back ${user.name}`)
        })
        .addCase(loginUser.rejected, (state, {payload}) =>{
            state.isLoading = false;
            toast.error(payload);
        })

        // updated value
     .addCase(updateUser.fulfilled, (state, { payload }) => {
        const { user } = payload;
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user);

        toast.success(`User Updated!`);
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
      //clear data
    //   .addCase(clearStore.rejected, () => {
    //     toast.error('There was an error..');
    //   });
    },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;