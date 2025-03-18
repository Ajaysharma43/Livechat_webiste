import { configureStore } from '@reduxjs/toolkit'
import uploadFileReducer from './features/uploadreducer'

export const store = configureStore({
  reducer: {
    uploadFileReducer : uploadFileReducer
  },
})