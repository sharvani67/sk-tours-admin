import React, { useState } from 'react';
import AboutExhibition from './AboutExhibition/AboutExhibition';
import DomesticExhibition from './DomesticExhibition/DomesticExhibition';
import InternationalExhibition from './InternationalExhibition/InternationalExhibition';
import './Exhibition.css';

const Exhibition = () => {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About Exhibition', component: <AboutExhibition /> },
    { id: 'domestic', label: 'Domestic Exhibition', component: <DomesticExhibition /> },
    { id: 'international', label: 'International Exhibition', component: <InternationalExhibition /> }
  ];

  return (
    <div className="exhibition-container container-fluid">
      <h1 className="mb-4 text-center">Exhibition</h1>
      
      {/* Navigation Tabs */}
      <nav>
        <div className="nav nav-tabs mb-4" id="exhibition-tab" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
          >
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exhibition;