import React from 'react';
import { Card } from 'react-bootstrap';

function MiceSidebar({ activeTab, setActiveTab, setShowForm, resetForms }) {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
    resetForms();
  };

  return (
    <Card className="mb-4">
      <Card.Body className="p-3">
        <h5 className="mb-3">MICE Management</h5>
        <nav className="nav flex-column">
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'main' ? 'active' : ''}`}
            onClick={() => handleTabClick('main')}
          >
            MICE Main Page
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'freeflow' ? 'active' : ''}`}
            onClick={() => handleTabClick('freeflow')}
          >
            Free Flow Entry
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => handleTabClick('packages')}
          >
            Sample Packages
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => handleTabClick('clients')}
          >
            Our Clients
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'venues' ? 'active' : ''}`}
            onClick={() => handleTabClick('venues')}
          >
            Venues
          </button>
          <button
            className={`nav-link text-start mb-2 ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => handleTabClick('gallery')}
          >
            MICE Gallery
          </button>
          <button
            className={`nav-link text-start ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => handleTabClick('events')}
          >
            Upcoming Events
          </button>
        </nav>
      </Card.Body>
    </Card>
  );
}

export default MiceSidebar;