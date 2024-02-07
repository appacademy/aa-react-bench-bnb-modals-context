import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBenches, selectBenchesArray } from '../../store/benches';
import FilterForm from './FilterForm';
import BenchList from './BenchList';
import BenchMap from '../BenchMap';
import './BenchIndex.css';

function BenchIndex() {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const benches = useSelector(selectBenchesArray);
  const [minSeating, setMinSeating] = useState(1);
  const [maxSeating, setMaxSeating] = useState(10);
  const [highlightedBench, setHighlightedBench] = useState(null);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (minSeating && maxSeating && bounds) {
      dispatch(fetchBenches({ minSeating, maxSeating, bounds }));
    }
  }, [minSeating, maxSeating, bounds, dispatch]);

  const mapEventHandlers = useMemo(() => ({
    click: event => {
      const search = new URLSearchParams(event.latLng.toJSON()).toString();
      navigate({ pathname: '/benches/new', search });
    },
    idle: map => setBounds(map.getBounds().toUrlValue())
  }), [navigate]);

  return (
    <div className="bench-index-page">
      <div className="bench-index-map-container">
        <h2>Click Map to Add Bench!</h2>
        <BenchMap
          benches={benches}
          mapEventHandlers={mapEventHandlers}
          markerEventHandlers={{
            click: (bench) => navigate(`/benches/${bench.id}`),
            mouseover: (bench) => setHighlightedBench(bench.id),
            mouseout: () => setHighlightedBench(null)
          }}
          highlightedBench={highlightedBench} 
        />
      </div>
      <div className="bench-list-container">
        <FilterForm
          minSeating={minSeating}
          maxSeating={maxSeating}
          setMinSeating={setMinSeating}
          setMaxSeating={setMaxSeating}
        />
        <BenchList 
          benches={benches} 
          highlightedBench={highlightedBench} 
          setHighlightedBench={setHighlightedBench} 
        />
      </div>
  </div>
  );
}

export default BenchIndex;
