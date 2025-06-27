// Export all Redux components from a single file
import {
  store,
  useAppDispatch,
  useAppSelector,
  type RootState,
  type AppDispatch,
} from './store';
import userReducer, {
  fetchUser,
  clearUser,
  updateUserInfo,
  type User,
} from './userSlice';

export {
  // Store
  store,

  // Hooks
  useAppDispatch,
  useAppSelector,

  // Types
  type RootState,
  type AppDispatch,
  type User,

  // Reducers
  userReducer,

  // Actions
  fetchUser,
  clearUser,
  updateUserInfo,
};
