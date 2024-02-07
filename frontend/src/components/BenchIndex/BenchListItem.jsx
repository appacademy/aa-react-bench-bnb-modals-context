import { useNavigate } from 'react-router-dom';

function BenchListItem({ bench, isHighlighted, setHighlightedBench }) {
  const { title, photoUrl, price, averageRating } = bench;
  const navigate = useNavigate(); 

  return (
    <div
      className={"bench-list-item" + (isHighlighted ? " highlighted" : "")}
      onClick={() => navigate(`/benches/${bench.id}`)}
      onMouseEnter={() => setHighlightedBench(bench.id)}
      onMouseLeave={() => setHighlightedBench(null)}
    >
      <div className="list-item-info">
        <h2>{title}</h2>
        <div className="list-item-fields">
          <div className="info-field">
            <span className="list-item-category">Average Rating:</span>
            <span className="list-item-copy">
              {averageRating || 'No reviews yet'}
            </span>
          </div>
          <div className="info-field">
            <span className="list-item-category">Price:</span>
            <span className="list-item-copy">${price}</span>
          </div>
        </div>
      </div>
      {photoUrl && <img src={photoUrl} alt='Bench'/>}
    </div>
  );
}

export default BenchListItem;
