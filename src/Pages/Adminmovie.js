import React, { useState } from 'react';
import '../Style/Adminmovie.css';

const Adminmovie = () => {
  const [step, setStep] = useState(1);
  const [movieData, setMovieData] = useState({
    key: '',
    id: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to Movies.json
    const existingMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    existingMovies.push(movieData);
    localStorage.setItem('movies', JSON.stringify(existingMovies));
    alert('Movie added successfully!');
    // Reset
    setMovieData({ key: '', id: '', password: '' });
    setStep(1);
  };

  return (
    <div className="admin-movie-container">
      <h2>Add Movie</h2>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <label>Key:</label>
            <input type="text" name="key" value={movieData.key} onChange={handleInputChange} required />
          </div>
        )}
        {step === 2 && (
          <div>
            <label>ID:</label>
            <input type="text" name="id" value={movieData.id} onChange={handleInputChange} required />
          </div>
        )}
        {step === 3 && (
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={movieData.password} onChange={handleInputChange} required />
          </div>
        )}
        <div className="buttons">
          {step > 1 && <button type="button" onClick={prevStep}>Previous</button>}
          {step < 3 && <button type="button" onClick={nextStep}>Next</button>}
          {step === 3 && <button type="submit">Submit</button>}
        </div>
      </form>
    </div>
  );
};

export default Adminmovie;
