import { createSelector } from 'reselect';
import { csrfFetch } from './csrf';
import { ADD_REVIEW, REMOVE_REVIEW } from './reviews';


const SET_BENCHES = 'benches/setBenches';
export const ADD_BENCH = 'benches/addBench';

const setBenches = benches => {
  return {
    type: SET_BENCHES,
    payload: benches
  }
};

export const addBench = payload => {
  return {
      type: ADD_BENCH,
      payload
  }
};

export const fetchBenches = filters => async dispatch => {
  const filterParams = new URLSearchParams(filters);
  const response = await csrfFetch(`/api/benches?${filterParams}`);
  const data = await response.json();
  dispatch(setBenches(data.benches));
  return response;
};

export const fetchBench = benchId => async dispatch => {
  const response = await csrfFetch(`/api/benches/${benchId}`);
  const data = await response.json();
  console.log("thunk", data)
  dispatch(addBench(data));
  return response;
}

export const createBench = benchFormData => async dispatch => {
  const response = await csrfFetch("/api/benches", {
    method: "POST",
    body: benchFormData
  });
  const data = await response.json();
  dispatch(addBench(data));
  return response;
};

export const selectBenches = state => state.benches;

export const selectBenchesArray = createSelector(selectBenches, benches => {
    return Object.values(benches);
});

function benchesReducer(state = {}, action) {
  switch (action.type) {
    case SET_BENCHES:
      return action.payload;
    case ADD_BENCH: {
      const bench = action.payload.bench;
      return { ...state, [bench.id]: bench };
    }
    case ADD_REVIEW: {
      const bench = action.payload.bench;
      return {...state, [bench.id]: bench}
    }
    case REMOVE_REVIEW: {
      const bench = action.payload.bench;
      return {...state, [bench.id]: bench}
    }
    default:
      return state;
  }
}

export default benchesReducer;
