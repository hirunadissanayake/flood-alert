import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import reportReducer from '../slices/reportSlice';
import sosReducer from '../slices/sosSlice';
import shelterReducer from '../slices/shelterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportReducer,
    sos: sosReducer,
    shelters: shelterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
