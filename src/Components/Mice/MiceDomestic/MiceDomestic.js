import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MiceDomesticTable from './MiceDomesticTable';

const MiceDomestic = () => {
  const navigate = useNavigate();
  
  // Sample domestic MICE data
  const [miceEvents, setMiceEvents] = useState([
    { 
      id: 'MD001', 
      name: 'Corporate Conference Mumbai', 
      city: 'Mumbai', 
      startDate: '2024-04-15', 
      endDate: '2024-04-17', 
      description: 'Annual corporate conference for IT companies',
      category: 'Conference',
      participants: '500',
      status: 'Upcoming'
    },
    { 
      id: 'MD002', 
      name: 'Sales Incentive Goa', 
      city: 'Goa', 
      startDate: '2024-05-10', 
      endDate: '2024-05-13', 
      description: 'Sales team incentive trip',
      category: 'Incentive',
      participants: '150',
      status: 'Upcoming'
    },
    { 
      id: 'MD003', 
      name: 'Medical Convention Delhi', 
      city: 'Delhi', 
      startDate: '2024-03-20', 
      endDate: '2024-03-22', 
      description: 'International medical convention',
      category: 'Conference',
      participants: '1000',
      status: 'Completed'
    }
  ]);

  const handleEdit = (event) => {
    navigate(`/mice/domestic/edit/${event.id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this MICE event?')) {
      setMiceEvents(miceEvents.filter(event => event.id !== id));
    }
  };

  const handleAddNew = () => {
    navigate('/mice/domestic/new');
  };

  const handleBookNow = (id) => {
    alert(`Booking for MICE Event ${id}. Redirecting to payment gateway...`);
    // In real app: navigate to payment gateway
  };

  return (
    <div className="mice-domestic">
      <div className="row">
        {/* Left Panel - MICE Categories */}
        <div className="col-md-3">
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">MICE Categories</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <i className="fas fa-calendar-alt me-2 text-info"></i>
                  Conference
                </li>
                <li className="list-group-item">
                  <i className="fas fa-calendar-alt me-2 text-info"></i>
                  Meeting
                </li>
                <li className="list-group-item">
                  <i className="fas fa-calendar-alt me-2 text-info"></i>
                  Incentive
                </li>
                <li className="list-group-item">
                  <i className="fas fa-calendar-alt me-2 text-info"></i>
                  Exhibition
                </li>
                <li className="list-group-item">
                  <i className="fas fa-calendar-alt me-2 text-info"></i>
                  Seminar
                </li>
                <li className="list-group-item">
                  <i className="fas fa-calendar-alt me-2 text-info"></i>
                  Workshop
                </li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Cities</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <i className="fas fa-city me-2 text-info"></i>
                  Mumbai
                </li>
                <li className="list-group-item">
                  <i className="fas fa-city me-2 text-info"></i>
                  Delhi
                </li>
                <li className="list-group-item">
                  <i className="fas fa-city me-2 text-info"></i>
                  Bangalore
                </li>
                <li className="list-group-item">
                  <i className="fas fa-city me-2 text-info"></i>
                  Chennai
                </li>
                <li className="list-group-item">
                  <i className="fas fa-city me-2 text-info"></i>
                  Kolkata
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel - Main Content */}
        <div className="col-md-9">
          <MiceDomesticTable 
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

export default MiceDomestic;