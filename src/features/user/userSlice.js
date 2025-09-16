import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getUserFromLocalStorage, addUserToLocalStorage, removeUserFromLocalStorage } from "../../utils/localStorage";
import { loginUserThunk, registerUserThunk, UpdateUserThunk, clearStoreThunk } from "./userThunk";

const initialState ={
    isLoading: false,
    isSidebarOpen:false,
    user: getUserFromLocalStorage(),
};

export const registerUser = createAsyncThunk('user/registerUser', async (user, thunkAPI)=>{
   
        return registerUserThunk('/auth/register', user, thunkAPI);       
});

export const loginUser = createAsyncThunk('user/loginUser', async (user, thunkAPI)=>{
    return loginUserThunk('/auth/login', user, thunkAPI);
});

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async(user, thunkAPI)=>{
       return UpdateUserThunk('/auth/updateUser', user, thunkAPI);
    }
);

export const clearStore = createAsyncThunk('user/clearStore', clearStoreThunk)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        toggleSidebar: (state)=>{
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        logoutUser: (state, {payload})=>{
            state.user = null;
            state.isSidebarOpen = false;
            removeUserFromLocalStorage();
            if(payload){
                toast.success(payload);
            }
        }
    },
    extraReducers:(builder) =>{
        builder
        //Register User
        .addCase(registerUser.pending,(state) =>{
            state.isLoading = true;
        })
        .addCase(registerUser.fulfilled,(state, {payload}) =>{
            //console.log("REGISTER SUCCESS PAYLOAD:", payload);
            const { user } = payload;
            state.isLoading = false;
            state.user = user;
            addUserToLocalStorage(user);
            toast.success(`Hello There ${user.name}`)
        })
        .addCase(registerUser.rejected,(state, {payload}) =>{
            state.isLoading = false;
            toast.error(payload);
        })

        //Login User
        .addCase(loginUser.pending,(state) =>{
            state.isLoading = true;
        })
        .addCase(loginUser.fulfilled,(state, {payload}) =>{
            const { user } = payload;
            state.isLoading = false;
            state.user =  user;
            addUserToLocalStorage( user );
            toast.success(`Welcome Back ${user.name}`)
        })
        .addCase(loginUser.rejected,(state, {payload}) =>{
            state.isLoading = false;
            toast.error(payload);
        })

        // updated value
    .addCase(updateUser.pending,(state) =>{
            state.isLoading = true;
        })
     .addCase(updateUser.fulfilled,(state, { payload }) => {
        // const { user, token, location } = payload;
        // state.isLoading = false;
        // state.user = { user, token, location };
        // addUserToLocalStorage({ user, token, location });
        // toast.success(`User Updated!`);
        const { user } = payload;
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user);
        toast.success(`User Updated!`);
      })
      .addCase(updateUser.rejected,(state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      
      //clear data
      .addCase(clearStore.rejected, () => {
        toast.error('There was an error..');
      });
    },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;