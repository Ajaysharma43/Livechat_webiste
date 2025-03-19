import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AuthInstance } from "../../../Interseptores/AuthInterseptor"

export const Signup = createAsyncThunk('Signup', async ({formData}) => {
    try {
        const response = await AuthInstance.post('/Signup' , {formData })
        return response.data
    } 
    catch (error) {
        console.log(error)
    }
})

const initialState = {
    data: {},
    loading: false,
    error: "",
    Success: false,
    Message: ""
};

const Authreducer = createSlice({
    initialState,
    name: 'Authreducer',
    extraReducers : (builder) => {
        builder.addCase(Signup.pending , (state) => {
            state.loading = true;
        })
        builder.addCase(Signup.fulfilled, (state, action) => {
            state.Success = action.payload.success;
            state.Message = action.payload.message;
            state.loading = false;
        });
        builder.addCase(Signup.rejected , (state , action) => {
            state.error = action.payload.error
        })
    }
})

export default Authreducer.reducer