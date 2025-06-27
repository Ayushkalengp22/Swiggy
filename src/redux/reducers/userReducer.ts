import {FETCH_USER_SUCCESS, FETCH_USER_FAILURE} from '../action/userActions';

interface UserState {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  error?: string;
}

const initialState: UserState = {
  id: null,
  name: '',
  email: '',
  phone: '',
  address: '',
};

const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        error: '',
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        error: 'Failed to fetch user data',
      };
    default:
      return state;
  }
};

export default userReducer;
