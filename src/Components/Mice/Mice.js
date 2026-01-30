import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminLayout from '../../Shared/Navbar/Navbar';
import AboutMice from './AboutMice/AboutMice';
import MiceDomestic from './MiceDomestic/MiceDomestic';
import MiceInternational from './MiceInternational/MiceInternational';
import MiceEnquiryForm from './MiceEnquiry/MiceEnquiryForm';
import './Mice.css';

const Mice = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About MICE', path: '/mice', component: <AboutMice /> },
    { id: 'domestic', label: 'Domestic MICE', path: '/mice/domestic', component: <MiceDomestic /> },
    { id: 'international', label: 'International MICE', path: '/mice/international', component: <MiceInternational /> },
    { id: 'enquiry', label: 'MICE Enquiry', path: '/mice/enquiry', component: <MiceEnquiryForm /> }
  ];

  return (
    <AdminLayout>
      <div className="content-wrapper">
        <div className="mice-container container-fluid">
          <h1 className="mb-4 text-center">MICE Management</h1>
          <p className="text-center text-muted mb-4">
            Meetings, Incentives, Conferences, and Exhibitions
          </p>
          
          {/* Navigation Tabs */}
          <nav>
            <div className="nav nav-tabs mb-4" id="mice-tab" role="tablist">
              {tabs.map(tab => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`nav-link ${location.pathname === tab.path ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Tab Content */}
          <div className="tab-content">
            <Routes>
              <Route path="/" element={<AboutMice />} />
              <Route path="/domestic" element={<MiceDomestic />} />
              <Route path="/international" element={<MiceInternational />} />
              <Route path="/enquiry" element={<MiceEnquiryForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Mice;