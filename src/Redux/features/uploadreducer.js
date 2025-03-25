import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UploadFileInstance } from "../../../Interseptores/UploadInterseptors";
import { GetFileInstance } from "../../../Interseptores/GetFIleInstance";

export const UploadFile = createAsyncThunk('UploadFile', async ({formData}) => {
    for(let pair of formData)
    {
        console.log(pair[0], pair[1]);
    }
    
    const response = await UploadFileInstance.post('/uploadfile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
});

export const GetFiles = createAsyncThunk('GetFiles' , async({limit}) => {
    console.log(limit)
    const response = await GetFileInstance.get(`/check?folderName=Images&limit=${limit}`)
    console.log(response.data)
    return response.data.files
})

const initialState = {
    Data: []
};

const UploadReducer = createSlice({
    initialState,
    name: "UploadReducer",
    extraReducers: (builder) => {
        builder.addCase(UploadFile.fulfilled, (state, action) => {
            state.Data = action.payload;
        });

        builder.addCase(GetFiles.fulfilled  , (state , action) => {
            state.Data = action.payload
        })
    }
});

export default UploadReducer.reducer;