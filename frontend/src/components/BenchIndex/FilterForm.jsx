import { Input } from '../formElements';

function FilterForm({ minSeating, maxSeating, setMinSeating, setMaxSeating }) {
  const parseValue = val => val === '' ? val : parseInt(val);

  return (
    <div className="filter-form">
      <h2>Filter results:</h2>
      <div className="filter-fields">
        <Input
          label="Minimum Seats:"
          type="number"
          value={minSeating}
          onChange={e => setMinSeating(parseValue(e.target.value))}
        />

        <Input
          label="Maximum Seats:"
          type="number"
          value={maxSeating}
          onChange={e => setMaxSeating(parseValue(e.target.value))}
        />
      </div>
    </div>
  )
}

export default FilterForm;
