import { useState } from 'react';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  // Render-এ ডেপ্লয় করার পর ব্যাকএন্ডের আসল লিঙ্কটি পরে এখানে বসাতে হবে
  const BACKEND_URL = "http://localhost:5000"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl })
      });
      const data = await response.json();
      setShortUrl(`${BACKEND_URL}/${data.shortCode}`);
    } catch (error) {
      alert('Error shortening URL');
    }
  };

  return (
    <div className="container">
      <h2>Short URL Generator</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="url" 
          placeholder="Paste long URL here..." 
          value={longUrl} 
          onChange={(e) => setLongUrl(e.target.value)} 
          required 
        />
        <button type="submit">Shorten</button>
      </form>
      
      {shortUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>Shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
        </div>
      )}
    </div>
  );
}

export default App;
