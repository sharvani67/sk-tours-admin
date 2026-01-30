import React, { useState } from 'react';

const MiceQA = ({ questions, updateAnswer }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleAnswer = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mice-qa">
      <h3 className="mb-3">MICE Questions & Answers</h3>
      <div className="accordion" id="miceAccordion">
        {questions.map((item, index) => (
          <div className="accordion-item" key={item.id}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                onClick={() => toggleAnswer(item.id)}
                aria-expanded={expandedId === item.id}
              >
                <strong>{item.question}</strong>
                <span className="badge bg-secondary ms-2">{item.id}</span>
              </button>
            </h2>
            <div className={`accordion-collapse collapse ${expandedId === item.id ? 'show' : ''}`}>
              <div className="accordion-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Answer</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={item.answer}
                    onChange={(e) => updateAnswer(item.id, e.target.value)}
                    placeholder="Enter answer here..."
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Question ID: {item.id}
                  </small>
                  <small className="text-muted">
                    Last updated: {new Date().toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiceQA;