import { ADD_BENCH } from './benches';
import { ADD_REVIEW } from './reviews';

const ADD_USER = 'users/addUser';
const ADD_USERS = 'users/addUsers';

export const addUser = (user) => ({
  type: ADD_USER,
  payload: user
});

export const addUsers = (users) => ({
  type: ADD_USERS,
  payload: users
});

function usersReducer(state = {}, action) {
  Object.freeze(state);
  switch (action.type) {
    case ADD_USER: {
      const user = action.payload;
      return { ...state, [user.id]: user };
    }
    case ADD_BENCH: {
      const users = action.payload.users;
      return { ...state, ...users };
    }
    case ADD_REVIEW: {
      const user = action.payload.user;
      return { ...state, [user.id]: user}
    }
    default:
      return state;
  }
}

export default usersReducer;
