import { useState, useEffect } from 'react';
import { getHelloWorld } from './services/api';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getHelloWorld();
        setMessage(data.message);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data from backend');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>React + Backend API</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {message && (
        <div>
          <h2>Message from Backend:</h2>
          <p>{message}</p>
        </div>
      )}
      
      <button onClick={async () => {
        try {
          const data = await getHelloWorld();
          setMessage(data.message);
        } catch (err) {
          setError('Failed to fetch data');
        }
      }}>
        Refresh Message
      </button>
    </div>
  );
}

export default App;