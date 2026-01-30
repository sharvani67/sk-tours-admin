import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutMiceTable from './AboutMiceTable';
import MiceQA from './MiceQA';

const AboutMice = () => {
  const navigate = useNavigate();
  
  // Initial MICE questions
  const [questions, setQuestions] = useState([
    { 
      id: 'MICE001', 
      question: 'What is Travel Exhibitions??', 
      answer: 'Travel exhibitions are events where travel companies showcase their services to potential clients and partners.' 
    },
    { 
      id: 'MICE002', 
      question: 'Why Should Travel Agent Attend Travel Exhibitions??', 
      answer: 'To network, find new business opportunities, and stay updated with industry trends.' 
    },
    { 
      id: 'MICE003', 
      question: 'What will travel Agents Gain by Attending Travel Exhibitions?', 
      answer: 'They gain industry insights, potential partnerships, and direct client contacts.' 
    },
    { 
      id: 'MICE004', 
      question: 'How can Travel Agents Inter Relate the Exhibition with their Travel Agencies??', 
      answer: 'By implementing strategies learned at exhibitions and applying them to their agency operations.' 
    },
    { 
      id: 'MICE005', 
      question: 'Is there any scope for Travel Agents to Attend Exhibitions?', 
      answer: 'Yes, significant scope exists for professional growth and business expansion.' 
    },
    { 
      id: 'MICE006', 
      question: 'Should Travel Agent Exhibit in Exhibition?', 
      answer: 'Yes, exhibiting helps in brand visibility and direct client acquisition.' 
    },
    { 
      id: 'MICE007', 
      question: 'Should Travel Agent take his own Stall?', 
      answer: 'Depends on budget, business goals, and expected ROI.' 
    },
    { 
      id: 'MICE008', 
      question: 'Should Travel Agent participate through Tourism booth?', 
      answer: 'Yes, it can be more cost-effective and provides government support.' 
    },
    { 
      id: 'MICE009', 
      question: 'How do we summarise the Participation or Exhibiting in Travel Exhibition?', 
      answer: 'It is an investment in business growth, networking, and market visibility.' 
    }
  ]);

  // Countries data
  const countries = ['Bangkok', 'Dubai', 'United Kingdom', 'Spain', 'Germany', 'China'];

  const updateAnswer = (id, answer) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, answer } : q));
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleEdit = (question) => {
    navigate(`/mice/about/edit/${question.id}`);
  };

  const handleAddNew = () => {
    navigate('/mice/about/new');
  };

  return (
    <div className="about-mice">
      <div className="row">
        {/* Left Panel - MICE Importance */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">MICE Importance</h4>
            </div>
            <div className="card-body">
              <h5 className="card-title">Important Information About MICE</h5>
              <p className="card-text">
                MICE (Meetings, Incentives, Conferences, and Exhibitions) represents a specialized segment of the tourism industry that deals with planning, booking, and facilitating conferences, seminars, exhibitions, and other events.
              </p>
              
              <h6 className="mt-4">Key Countries for MICE:</h6>
              <ul className="list-group list-group-flush">
                {countries.map((country, index) => (
                  <li key={index} className="list-group-item">
                    <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                    {country}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel - Main Content */}
        <div className="col-md-8">
          <h2>About MICE</h2>
          
          {/* Table Section */}
          <AboutMiceTable 
            questions={questions}
            onEdit={handleEdit}
            onDelete={deleteQuestion}
            onAddNew={handleAddNew}
          />

          {/* Question-Answer Accordion Section */}
          <div className="qa-section mt-4">
            <MiceQA 
              questions={questions}
              updateAnswer={updateAnswer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMice;