import { useState } from 'react';

function App() {
  const [view, setView] = useState<'patient' | 'doctor'>('patient');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setApproved(false);
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
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1>KneeHealer AI</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setView('patient')}
          style={{ fontWeight: view === 'patient' ? 'bold' : 'normal', marginRight: '10px' }}
        >
          Patient View
        </button>
        <button
          onClick={() => setView('doctor')}
          style={{ fontWeight: view === 'doctor' ? 'bold' : 'normal' }}
        >
          Doctor View
        </button>
      </div>

      {view === 'patient' && (
        <>
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
        </>
      )}

      {view === 'doctor' && (
        <>
          <h2>Patient Case Review</h2>
          {!result && <p style={{ color: '#888' }}>No patient scan analyzed yet. Switch to Patient View to upload a scan first.</p>}

          {result && (
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
              <h3>AI Analysis Summary</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <tbody>
                  <tr><td style={{ padding: '6px', fontWeight: 'bold' }}>Femur Width</td><td>{result.femur_width_px} px</td></tr>
                  <tr><td style={{ padding: '6px', fontWeight: 'bold' }}>Tibia Width</td><td>{result.tibia_width_px} px</td></tr>
                  <tr><td style={{ padding: '6px', fontWeight: 'bold' }}>OA Grade</td><td>{result.oa_grade}</td></tr>
                  <tr><td style={{ padding: '6px', fontWeight: 'bold' }}>Severity</td><td>{result.severity}</td></tr>
                </tbody>
              </table>

              <h3>TKA Implant Planning</h3>
              <p><strong>Recommended Implant Size:</strong> {result.implant_size}</p>
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                Based on patient-specific femoral measurements. For clinical review only — final decision rests with the surgeon.
              </p>

              <div style={{ marginTop: '20px' }}>
                {!approved ? (
                  <button onClick={() => setApproved(true)} style={{ padding: '8px 16px', background: '#2c7a2c', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Approve Plan
                  </button>
                ) : (
                  <p style={{ color: '#2c7a2c', fontWeight: 'bold' }}>✓ Plan Approved by Doctor</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;