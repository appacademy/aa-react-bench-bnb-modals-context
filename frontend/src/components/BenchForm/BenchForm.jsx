import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useInput, useSubmit } from '../../hooks/hooks';
import { createBench } from '../../store/benches';
import { FormErrors, Input, TextArea } from '../formElements';

function BenchForm() {
  const sessionUser = useSelector(state => state.session.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(()=>{
    if (!sessionUser) navigate("/login"); 
  }, [sessionUser, navigate]);
  
  const [title, onTitleChange] = useInput('');
  const [price, onPriceChange] = useInput(50);
  const [description, onDescriptionChange] = useInput('');
  const [seating, onSeatingChange] = useInput(2);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const [errors, onSubmit] = useSubmit({
    createAction: () => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('seating', seating);
      formData.append('lat', lat);
      formData.append('lng', lng);

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      return createBench(formData);
    },
    onSuccess: () => navigate('/')
  });

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        setPhotoFile(file);
        setPhotoUrl(fileReader.result);
      };
    }
  };

  return (
    <>
      <div className="new-bench-form">
        <h1>Create A Bench!</h1>

        <form onSubmit={onSubmit} className="form">
          <FormErrors errors={errors}/>
          <Input 
            label="Title"
            value={title}
            onChange={onTitleChange}
            required
          />
          <Input 
            label="Price"
            min="10"
            max="1000"
            type="number"
            value={price}
            onChange={onPriceChange}
            required
          />
          <TextArea
            label="Description"
            cols="50"
            rows="8"
            value={description}
            onChange={onDescriptionChange}
            required
          />
          <Input 
            label="Number of Seats"
            min="0"
            type="number"
            value={seating}
            onChange={onSeatingChange}
            required
          />
          <Input 
            label="Latitude"
            value={lat}
            disabled
          />
          <Input 
            label="Longitude"
            value={lng}
            disabled
          />
          <Input 
            label="Add a Picture"
            type="file" 
            onChange={handleFileChange}
          />

          {photoUrl && (
            <div className="image-preview">
              <h2>Image preview</h2>
              <img height="200px" src={photoUrl} alt="Preview" />
            </div>
          )}

          <div className="bench-form-buttons">
            <Link className="button" to="/">Cancel</Link>
            <button className="button">Create Bench</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default BenchForm;
