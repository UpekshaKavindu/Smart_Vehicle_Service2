import { useState } from 'react';
import { customerApi } from '../../api/customerApi';

export default function AiSummary({ customerId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');
  const [specificQuestion, setSpecificQuestion] = useState('');

  const fetchSummary = async (withQuestion = false) => {
    setLoading(true);
    setError(null);
    try {
      const options = {
        includeServiceHistory: true,
        includeBookings: true,
        includeMaintenance: true,
        specificQuestion: withQuestion ? specificQuestion : null
      };
      const result = await customerApi.getAiSummary(customerId, options);
      setSummary(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await customerApi.askAi(customerId, question);
      setSummary(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h5>AI Customer Assistant</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <button className="btn btn-outline-primary me-2" onClick={() => fetchSummary(false)} disabled={loading}>
            Generate Summary
          </button>
          <button className="btn btn-outline-secondary" onClick={() => fetchSummary(true)} disabled={loading}>
            Generate with Specific Question
          </button>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Specific question (optional)"
            value={specificQuestion}
            onChange={(e) => setSpecificQuestion(e.target.value)}
          />
        </div>
        <hr />
        <div className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Ask a question about this customer..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button className="btn btn-primary" onClick={askQuestion} disabled={loading || !question.trim()}>
              Ask
            </button>
          </div>
        </div>

        {loading && <div className="spinner-border text-primary" role="status" />}
        {error && <div className="alert alert-danger">{error}</div>}
        {summary && (
          <div className="mt-3">
            <h6>Response:</h6>
            <div className="p-3 bg-light rounded" style={{ whiteSpace: 'pre-wrap' }}>
              {summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}