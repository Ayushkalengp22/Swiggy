// /src/redux/store.ts
import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;

// Optional: export RootState and AppDispatch for typed hooks
export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export type AppDispatch = typeof store.dispatch;
