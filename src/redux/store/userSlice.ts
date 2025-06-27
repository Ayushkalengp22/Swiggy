import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getUser} from '../../../api/login/auth'; // Adjust the path based on your file structure

// Define user interface
export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

// Define the state structure
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Create async thunk for fetching user data
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId: number, {rejectWithValue}) => {
    try {
      const userData = await getUser(userId);
      return userData;
    } catch (error) {
      return rejectWithValue('Failed to fetch user data');
    }
  },
);

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: state => {
      state.user = null;
      state.error = null;
    },
    updateUserInfo: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {...state.user, ...action.payload};
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const {clearUser, updateUserInfo} = userSlice.actions;

// Make sure we export the reducer as a default export
export default userSlice.reducer;
