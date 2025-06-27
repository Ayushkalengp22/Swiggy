import {Dispatch} from 'redux';
import axios from 'axios';
// import { API_BASE_URL } from '../../config'; // adjust this path
const API_BASE_URL = 'http://192.168.50.11:9000';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const getUserData = (userId: number) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getuser`, {
      params: {userId},
    });

    dispatch({
      type: FETCH_USER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_FAILURE,
      payload: error,
    });
    console.error('Error fetching user:', error);
  }
};
