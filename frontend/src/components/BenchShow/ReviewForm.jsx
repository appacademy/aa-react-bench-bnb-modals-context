import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useInput, useSubmit } from '../../hooks/hooks';
import { createReview } from '../../store/reviews';
import { FormErrors, Input, TextArea } from '../formElements';

function ReviewForm({ bench, closeForm }) {
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  const [rating, onRatingChange] = useInput(5);
  const [body, onBodyChange] = useInput("");
  const [errors, onSubmit] = useSubmit({ 
    onSuccess: closeForm,
    action: createReview({ rating, body, benchId: bench.id })
  });

  useEffect(()=>{
    if (!sessionUser) navigate("/login");
  }, [sessionUser, navigate]);

  return (
    <>
      <div className="review-form">
        <h1>Create Review</h1>
        <form onSubmit={onSubmit} className="form">
          <FormErrors errors={errors} />
          <Input
            label="Rating"
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={onRatingChange}
            required
          />
          <TextArea
            label="Comment"
            cols="30"
            rows="10"
            value={body}
            onChange={onBodyChange}
            required
          />
          <div className="review-form-buttons">
            <button onClick={closeForm} className="button" type="button">Cancel</button>
            <button className="button" type="submit">Submit Review</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ReviewForm;
