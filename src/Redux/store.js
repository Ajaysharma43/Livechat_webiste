import { configureStore } from '@reduxjs/toolkit'
import uploadFileReducer from './features/uploadreducer'
import Authreducer from "./features/Authenticate"

export const store = configureStore({
  reducer: {
    uploadFileReducer : uploadFileReducer,
    Authreducer : Authreducer
  },
})