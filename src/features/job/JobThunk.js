import { showLoading, hideLoading, getAllJobs } from "../allJobs/allJobsSlice";
import customFetch, {checkForUnauthorizedResponse} from "../../utils/axios";
import { clearValues } from "./jobSlice";
import { logoutUser } from "../user/userSlice";

const authHeader = (thunkAPI)=>{
    return{
        headers:{
            authorization:`Bearer ${thunkAPI.getState().user.user.token}`,
        },
    }
}

export const createJobThunk = async(job, thunkAPI)=>{
    try{   
        const resp = await customFetch.post('/jobs', job, authHeader(thunkAPI));
        thunkAPI.dispatch(clearValues());
        return resp.data.msg;
    }catch(error){
        //logout user
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
};


export const deleteJobThunk = async(jobId, thunkAPI)=>{
        thunkAPI.dispatch(showLoading());
        try{
            const resp = await customFetch.delete(`/jobs/${jobId}`);
            thunkAPI.dispatch(getAllJobs());
            console.log("remove job");
            return resp.data.msg;
        }catch(error){
            thunkAPI.dispatch(hideLoading());
            return checkForUnauthorizedResponse(error, thunkAPI);
        }
    };

export const editJobThunk = async({jobId, job}, thunkAPI)=>{
    try{
        const resp = await customFetch.patch(`/jobs/${jobId}`, job);
        thunkAPI.dispatch(clearValues());
        return resp.data;
    }catch(error){
        return checkForUnauthorizedResponse(error, thunkAPI);
    }
};