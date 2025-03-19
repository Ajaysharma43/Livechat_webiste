import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthInstance } from "../../../Interseptores/AuthInterseptor";
import Cookies from "js-cookie";

export const Signup = createAsyncThunk("Signup", async ({ formData }) => {
    try {
        const response = await AuthInstance.post("/Signup", { formData });
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const Login = createAsyncThunk("Login", async ({ formData }) => {
    try {
        const response = await AuthInstance.post("/Login", { formData });
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

const initialState = {
    data: {},
    loading: false,
    error: "",
    Success: false,
    Message: "",
};

const Authreducer = createSlice({
    initialState,
    name: "Authreducer",
    extraReducers: (builder) => {
        builder.addCase(Signup.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(Signup.fulfilled, (state, action) => {
            state.Success = action.payload.success;
            state.Message = action.payload.message;
            state.loading = false;
        });
        builder.addCase(Signup.rejected, (state, action) => {
            state.error = action.payload.error;
        });

        builder.addCase(Login.pending, (state) => {
            state.Success = false;
            state.loading = true;
        });
        builder.addCase(Login.fulfilled, (state, action) => {
            state.Message = action.payload.message;
            Cookies.set("RefreshToken", action.payload.RefreshToken, { expires: 7 });
            sessionStorage.setItem("AccessToken", action.payload.AccessToken);
            state.Success = true
            setTimeout(() => {
                state.Success = false
                state.loading = false;
            }, 2000);

        });
        builder.addCase(Login.rejected, (state, action) => {
            state.error = action.payload.error
        })
    },
});

export default Authreducer.reducer;
