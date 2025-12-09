import { configureStore } from '@reduxjs/toolkit';
import { bonusesApi } from './api';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [bonusesApi.reducerPath]: bonusesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(bonusesApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

