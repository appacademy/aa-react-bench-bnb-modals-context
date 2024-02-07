import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BenchMap from '../BenchMap';
import ReviewForm from './ReviewForm';
import { fetchBench } from '../../store/benches';
import { destroyReview, getBenchReviews } from '../../store/reviews';
import { FaRectangleXmark } from "react-icons/fa6";
import './BenchShow.css';

function BenchShow() {
  const { benchId } = useParams();
  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);
  const bench = useSelector(state => state.benches[benchId]);
  const reviews = useSelector(getBenchReviews(parseInt(benchId)));

  useEffect(() => {
    dispatch(fetchBench(benchId));
  }, [benchId, dispatch]);

  if (!bench) return null;

  const { description, seating, lat, lng, averageRating, photoUrl } = bench;
  const hasReviewed = sessionUser && reviews.some(review => review.authorId === sessionUser.id);

  return (
    <div className="bench-show">
      <div className="bench-show-header">
        <h1>{bench.title}</h1>
        <Link to="/">Back to Benches Index</Link>
      </div>
      <div className="bench-show-visuals">
        {photoUrl && <img src={photoUrl} alt='Bench' className="bench-show-image"/>}
        <BenchMap
          benches={[bench]}
          mapOptions={{ center: { lat: bench.lat, lng: bench.lng }}}
        />
      </div>
      <section className="bench-show-section bench-details">
        <h2>Details</h2>
        <p>
          {description}
        </p>
        <ul>
          <li><span className='info-category'>Seats: </span>{seating}</li>
          <li><span className='info-category'>Latitude: </span>{lat}</li>
          <li><span className='info-category'>Longitude: </span>{lng}</li>
        </ul>
      </section>
      <section className="bench-show-section">
        <h2>Reviews</h2>
        <span className="average-rating">
          Average Rating: {averageRating || 'No reviews yet'}
        </span>
        <div className="reviews">
          {reviews.map(review => (
            <div className="review" key={review.id}>
              <h3>Rating: {review.rating}</h3>
              <span>{review.author}</span>
              <p>{review.body}</p>
              {review.authorId === sessionUser?.id && (
                <button 
                  onClick={() => dispatch(destroyReview(review.id))} 
                  className='delete-icon'
                >
                  <FaRectangleXmark />
                </button>
              )}
            </div>
          ))}
        </div>
        {!hasReviewed && <LeaveReview bench={bench} />}
      </section>
    </div>
  );
}

function LeaveReview({ bench }) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return showReviewForm ? (
    <ReviewForm 
      bench={bench} 
      closeForm={() => setShowReviewForm(false)}
    />
  ) : (
    <button className="button" onClick={() => setShowReviewForm(true)}>
      Leave a Review
    </button>
  );
}

export default BenchShow;
