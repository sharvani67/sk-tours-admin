import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MiceInternationalTable from './MiceInternationalTable';

const MiceInternational = () => {
  const navigate = useNavigate();
  
  // Sample international MICE data
  const [miceEvents, setMiceEvents] = useState([
    { 
      id: 'MI001', 
      name: 'Global Tech Summit Dubai', 
      country: 'Dubai', 
      startDate: '2024-06-10', 
      endDate: '2024-06-12', 
      description: 'International technology conference',
      category: 'Conference',
      participants: '2000',
      status: 'Upcoming'
    },
    { 
      id: 'MI002', 
      name: 'Sales Incentive Spain', 
      country: 'Spain', 
      startDate: '2024-07-15', 
      endDate: '2024-07-20', 
      description: 'Top performers incentive trip',
      category: 'Incentive',
      participants: '100',
      status: 'Upcoming'
    },
    { 
      id: 'MI003', 
      name: 'Medical Expo Germany', 
      country: 'Germany', 
      startDate: '2024-09-05', 
      endDate: '2024-09-08', 
      description: 'International medical equipment exhibition',
      category: 'Exhibition',
      participants: '3000',
      status: 'Upcoming'
    }
  ]);

  const handleEdit = (event) => {
    navigate(`/mice/international/edit/${event.id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this MICE event?')) {
      setMiceEvents(miceEvents.filter(event => event.id !== id));
    }
  };

  const handleAddNew = () => {
    navigate('/mice/international/new');
  };

  const handleBookNow = (id) => {
    alert(`Booking for International MICE Event ${id}. Redirecting to payment gateway...`);
    // In real app: navigate to payment gateway
  };

  return (
    <div className="mice-international">
      <div className="row">
        {/* Left Panel - Countries */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Countries</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <i className="fas fa-globe me-2 text-warning"></i>
                  Dubai
                </li>
                <li className="list-group-item">
                  <i className="fas fa-globe me-2 text-warning"></i>
                  United Kingdom
                </li>
                <li className="list-group-item">
                  <i className="fas fa-globe me-2 text-warning"></i>
                  Spain
                </li>
                <li className="list-group-item">
                  <i className="fas fa-globe me-2 text-warning"></i>
                  Germany
                </li>
                <li className="list-group-item">
                  <i className="fas fa-globe me-2 text-warning"></i>
                  China
                </li>
                <li className="list-group-item">
                  <i className="fas fa-globe me-2 text-warning"></i>
                  Thailand
                </li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Event Types</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <i className="fas fa-calendar-check me-2 text-warning"></i>
                  Conference
                </li>
                <li className="list-group-item">
                  <i className="fas fa-calendar-check me-2 text-warning"></i>
                  Meeting
                </li>
                <li className="list-group-item">
                  <i className="fas fa-calendar-check me-2 text-warning"></i>
                  Incentive
                </li>
                <li className="list-group-item">
                  <i className="fas fa-calendar-check me-2 text-warning"></i>
                  Exhibition
                </li>
                <li className="list-group-item">
                  <i className="fas fa-calendar-check me-2 text-warning"></i>
                  Seminar
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel - Main Content */}
        <div className="col-md-9">
          <MiceInternationalTable 
            miceEvents={miceEvents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={handleAddNew}
            onBookNow={handleBookNow}
          />
        </div>
      </div>
    </div>
  );
};

export default MiceInternational;