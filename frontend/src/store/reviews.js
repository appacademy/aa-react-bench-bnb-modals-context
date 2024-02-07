import { ADD_BENCH } from './benches';
import { csrfFetch } from './csrf';

export const ADD_REVIEW = 'reviews/addReview';
const ADD_REVIEWS = 'reviews/addReviews';
export const REMOVE_REVIEW = 'reviews/removeReview';

const addReview = review => ({
  type: ADD_REVIEW,
  payload: review
});

const removeReview = review => ({
  type: REMOVE_REVIEW,
  payload: review
});

export const addReviews = reviews => ({
  type: ADD_REVIEWS,
  payload: reviews
});

export const getBenchReviews = benchId => state => (
  Object.values(state.reviews)
    .filter(review => review.benchId === benchId)
    .map(review => ({ 
      ...review, 
      author: state.users[review.authorId]?.username
    }))
);

export const createReview = (review) => async dispatch => {
  const response = await csrfFetch("/api/reviews", {
    method: "POST",
    body: JSON.stringify(review)
  });
  const data = await response.json();
  dispatch(addReview(data));
  return response;
};

export const destroyReview = (reviewId) => async dispatch => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  dispatch(removeReview(data));
  return response;
};

function reviewsReducer(state = {}, action) {
  switch (action.type) {
    case ADD_REVIEW: {
      const review = action.payload.review;
      return { ...state, [review.id]: review };
    }
    case REMOVE_REVIEW: {
      const review = action.payload.review;
      const { [review.id]: _remove, ...newState } = state;
      return newState;
    }
    case ADD_BENCH: {
      const reviews = action.payload.reviews;
      return { ...state, ...reviews };
    }
    default:
      return state;
  }
}

export default reviewsReducer;
