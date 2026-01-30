import React, { useState } from 'react';

const ExhibitionQA = ({ questions, updateAnswer }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleAnswer = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="exhibition-qa">
      <h3>Exhibition Questions & Answers</h3>
      <div className="accordion" id="exhibitionAccordion">
        {questions.map((item, index) => (
          <div className="accordion-item" key={item.id}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                onClick={() => toggleAnswer(item.id)}
                aria-expanded={expandedId === item.id}
              >
                {item.question}
              </button>
            </h2>
            <div className={`accordion-collapse collapse ${expandedId === item.id ? 'show' : ''}`}>
              <div className="accordion-body">
                <textarea
                  className="form-control"
                  rows="3"
                  value={item.answer}
                  onChange={(e) => updateAnswer(item.id, e.target.value)}
                  placeholder="Enter answer here..."
                />
                <small className="text-muted">
                  Question ID: {item.id}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExhibitionQA;