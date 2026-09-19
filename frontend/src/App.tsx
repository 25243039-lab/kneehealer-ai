import { useState } from 'react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://127.0.0.1:8000/analyze', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '500px', margin: '0 auto' }}>
      <h1>KneeHealer AI</h1>
      <p>Upload a knee scan for AI-assisted OA assessment</p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Analyzing...' : 'Analyze Scan'}
      </button>

      {result && (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Results</h3>
          <p><strong>OA Grade:</strong> {result.oa_grade}</p>
          <p><strong>Severity:</strong> {result.severity}</p>
          <p><strong>Explanation:</strong> {result.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default App;