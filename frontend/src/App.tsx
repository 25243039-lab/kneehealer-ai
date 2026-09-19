import { useState } from 'react';
import Knee3D from './Knee3D';
import './App.css';

function App() {
  const [role, setRole] = useState<'select' | 'patient' | 'doctor'>('select');

  const [patientData, setPatientData] = useState({ name: '', age: '', symptoms: '' });
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [doctorForm, setDoctorForm] = useState({ name: '', license: '' });
  const [doctorVerified, setDoctorVerified] = useState(false);
  const [approved, setApproved] = useState(false);

  const severityColor = (sev: string) => {
    if (sev === 'Normal') return '#2c9a5b';
    if (sev === 'Doubtful' || sev === 'Mild') return '#d99a2b';
    if (sev === 'Moderate') return '#e0752e';
    return '#c0392b';
  };

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

  const resetAll = () => {
    setRole('select');
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">🦵</div>
          <div>
            <div className="navbar-title">KneeHealer AI</div>
            <div className="navbar-sub">AI-Assisted Knee Analysis & Implant Planning</div>
          </div>
        </div>
      </div>

      <div className="page">

        {role === 'select' && (
          <>
            <div className="hero">
              <h1>Welcome to KneeHealer AI</h1>
              <p>Choose how you'd like to continue</p>
            </div>
            <div className="role-grid">
              <div className="role-card" onClick={() => setRole('patient')}>
                <div className="role-icon">🧑‍🦽</div>
                <h3>I'm a Patient</h3>
                <p>Upload your knee scan and get an AI-assisted assessment</p>
              </div>
              <div className="role-card" onClick={() => setRole('doctor')}>
                <div className="role-icon">🩺</div>
                <h3>I'm a Doctor</h3>
                <p>Review patient cases and plan implant sizing</p>
              </div>
            </div>
          </>
        )}

        {role === 'patient' && (
          <>
            <button className="back-link" onClick={resetAll}>← Back</button>

            {!result ? (
              <div className="card">
                <h2 style={{ marginTop: 0, color: '#1e2a33' }}>Patient Details</h2>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={patientData.name}
                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={patientData.age}
                    onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                    placeholder="e.g. 58"
                  />
                </div>
                <div className="form-group">
                  <label>Symptoms / Medical History</label>
                  <textarea
                    rows={3}
                    value={patientData.symptoms}
                    onChange={(e) => setPatientData({ ...patientData, symptoms: e.target.value })}
                    placeholder="e.g. Knee pain while climbing stairs, stiffness in the morning"
                  />
                </div>

                <div className="upload-zone">
                  <p style={{ margin: '0 0 10px 0', color: '#5c6b73' }}>Upload your knee scan</p>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    className="btn-primary"
                    onClick={handleUpload}
                    disabled={!file || !patientData.name || !patientData.age || loading}
                  >
                    {loading ? 'Analyzing...' : 'Submit & Analyze Scan'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="card">
                <h2 style={{ marginTop: 0, color: '#1e2a33' }}>Thank you, {patientData.name}</h2>
                <p style={{ color: '#7a8a94' }}>Your scan has been analyzed. A summary is below — your doctor will review the full report.</p>
                <div className="result-box">
                  <p><strong>OA Grade:</strong> {result.oa_grade}</p>
                  <p>
                    <strong>Severity:</strong>{' '}
                    <span className="badge" style={{ background: severityColor(result.severity) }}>{result.severity}</span>
                  </p>
                  <p style={{ color: '#5c6b73' }}>{result.explanation}</p>
                </div>
              </div>
            )}
          </>
        )}

        {role === 'doctor' && (
          <>
            <button className="back-link" onClick={resetAll}>← Back</button>

            {!doctorVerified ? (
              <div className="card">
                <h2 style={{ marginTop: 0, color: '#1e2a33' }}>Doctor Verification</h2>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    placeholder="Dr. ..."
                  />
                </div>
                <div className="form-group">
                  <label>Medical License / Registration Number</label>
                  <input
                    type="text"
                    value={doctorForm.license}
                    onChange={(e) => setDoctorForm({ ...doctorForm, license: e.target.value })}
                    placeholder="e.g. TN-MED-12345"
                  />
                </div>
                <div className="form-group">
                  <label>Upload Medical Certificate</label>
                  <input type="file" accept="image/*,.pdf" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button
                    className="btn-primary"
                    disabled={!doctorForm.name || !doctorForm.license}
                    onClick={() => setDoctorVerified(true)}
                  >
                    Verify & Continue
                  </button>
                </div>
              </div>
            ) : (
              <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <span className="verified-badge">✓ Verified: Dr. {doctorForm.name}</span>
                </div>

                <h2 style={{ textAlign: 'center', color: '#1e2a33', marginTop: 0 }}>Patient Case Review</h2>

                {!result ? (
                  <div className="empty-state">No patient cases submitted yet. Ask a patient to submit their scan first.</div>
                ) : (
                  <>
                    <div className="patient-meta">
                      <strong>{patientData.name}</strong>, Age {patientData.age}<br />
                      Symptoms: {patientData.symptoms || 'Not provided'}
                    </div>

                    <div className="section-title">AI Analysis Summary</div>
                    <table className="info-table">
                      <tbody>
                        <tr><td>Femur Width</td><td>{result.femur_width_px} px</td></tr>
                        <tr><td>Tibia Width</td><td>{result.tibia_width_px} px</td></tr>
                        <tr><td>OA Grade</td><td>{result.oa_grade}</td></tr>
                        <tr><td>Severity</td><td><span className="badge" style={{ background: severityColor(result.severity) }}>{result.severity}</span></td></tr>
                      </tbody>
                    </table>

                    <div className="section-title">3D Bone Model</div>
                    <Knee3D femurWidth={result.femur_width_px} tibiaWidth={result.tibia_width_px} />

                    <div className="section-title">TKA Implant Planning</div>
                    <p><strong>Recommended Implant Size:</strong> {result.implant_size}</p>
                    <p style={{ fontSize: '0.9em', color: '#7a8a94' }}>
                      Based on patient-specific femoral measurements. For clinical review only — final decision rests with the surgeon.
                    </p>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      {!approved ? (
                        <button className="btn-success" onClick={() => setApproved(true)}>Approve Plan</button>
                      ) : (
                        <div className="approved-msg">✓ Plan Approved by Doctor</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default App;