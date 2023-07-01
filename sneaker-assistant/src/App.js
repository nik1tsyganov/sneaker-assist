import React, { useState } from 'react';
import './App.css';
import SneakerForm from './components/SneakerForm';
import SneakerResults from './components/SneakerResults';

function App() {
  const [budget, setBudget] = useState('');
  const [colors, setColors] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
        const response = await fetch('http://localhost:5010/api/get-sneaker-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ budget, colors }),
        });
        const data = await response.json();
        setResults(data);
    } catch (error) {
        console.error('Error:', error);
    }
  };

  return (
      <div className="App">
        <h1 className="title">Sneaker Picker</h1>
        <div className="form-container">
            <SneakerForm
              budget={budget}
              colors={colors}
              setBudget={setBudget}
              setColors={setColors}
              handleSubmit={handleSubmit}
            />
        </div>
        <div className="results-container">
            <SneakerResults results={results} />
        </div>
      </div>
  );
}

export default App;
