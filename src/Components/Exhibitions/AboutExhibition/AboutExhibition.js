import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutExhibitionTable from './AboutExhibitionTable';
import ExhibitionQA from './ExhibitionQA';

const AboutExhibition = () => {
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState('');
  
  // Questions for About Exhibition
  const [questions, setQuestions] = useState([
    { id: 'AQ1', question: 'What is Travel Exhibitions??', answer: 'Travel exhibitions are events.' },
    { id: 'AQ2', question: 'Why Should Travel Agent Attend Travel Exhibitions??', answer: 'To network and find new business opportunities.' },
    { id: 'AQ3', question: 'What will travel Agents Gain by Attending Travel Exhibitions?', answer: 'They gain industry insights and potential' },
    { id: 'AQ4', question: 'How can Travel Agents Inter Relate the Exhibition with their Travel Agencies?', answer: 'By implementing strategies learned at exhibitions.' },
    { id: 'AQ5', question: 'Is there any scope for Travel Agents to Attend Exhibitions?', answer: 'Yes, there is significant scope for growth.' },
    { id: 'AQ6', question: 'Should Travel Agent Exhibit in Exhibition?', answer: 'Yes, it helps in brand visibility.' },
    { id: 'AQ7', question: 'Should Travel Agent take his own Stall?', answer: 'Depends on budget and business goals.' },
    { id: 'AQ8', question: 'Should Travel Agent participate through Tourism booth?', answer: 'Yes, it can be more cost-effective.' },
    { id: 'AQ9', question: 'How do we summarise the Participation or Exhibiting in Travel Exhibition?', answer: 'It is beneficial for business growth.' }
  ]);

  const updateAnswer = (id, answer) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, answer } : q));
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleEdit = (question) => {
    navigate(`/exhibition/about/edit/${question.id}`);
  };

  const handleAddNew = () => {
    navigate('/exhibition/about/new');
  };

  return (
    <div className="about-exhibition">
      <h2>About Exhibition</h2>
      
      {/* Table Section */}
      <AboutExhibitionTable 
        questions={questions}
        onEdit={handleEdit}
        onDelete={deleteQuestion}
        onAddNew={handleAddNew}
      />

      {/* Exhibition Photo Section */}
      <div className="exhibition-photo-section mb-5">
        <h3>Exhibition Photo</h3>
        <div className="photo-upload-section mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter image URL or upload image"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
            <button className="btn btn-secondary" type="button">
              Upload
            </button>
          </div>
        </div>
        
        {photoUrl && (
          <div className="photo-preview">
            <img 
              src={photoUrl} 
              alt="Exhibition" 
              className="img-fluid rounded" 
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}
      </div>

      {/* Question-Answer Accordion Section */}
      <div className="qa-section mt-4">
        <ExhibitionQA 
          questions={questions}
          updateAnswer={updateAnswer}
        />
      </div>
    </div>
  );
};

export default AboutExhibition;