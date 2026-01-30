import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../Shared/Navbar/Navbar';
import AboutExhibition from './AboutExhibition/AboutExhibition';
import DomesticExhibition from './DomesticExhibition/DomesticExhibition';
import InternationalExhibition from './InternationalExhibition/InternationalExhibition';
import './Exhibition.css';

const Exhibition = () => {
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define all available tabs with their paths
  const tabs = [
    { 
      id: 'about', 
      label: 'About Exhibition', 
      component: <AboutExhibition />,
      path: '/exhibition'
    },
    { 
      id: 'domestic', 
      label: 'Domestic Exhibition', 
      component: <DomesticExhibition />,
      path: '/domestic-exhibition'
    },
    { 
      id: 'international', 
      label: 'International Exhibition', 
      component: <InternationalExhibition />,
      path: '/international-exhibition'
    }
  ];

  // Function to handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const selectedTab = tabs.find(tab => tab.id === tabId);
    if (selectedTab) {
      navigate(selectedTab.path);
    }
  };

  // Effect to sync URL with active tab
  useEffect(() => {
    // Find the tab that matches the current path
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab && currentTab.id !== activeTab) {
      setActiveTab(currentTab.id);
    } else if (location.pathname === '/' || !currentTab) {
      // Default to about exhibition if path doesn't match any tab
      navigate('/exhibition');
    }
  }, [location.pathname, navigate, activeTab]);

  return (
    <AdminLayout>
      <div className="content-wrapper">
        <div className="exhibition-container container-fluid">
          <h1 className="mb-4 text-center">Exhibition</h1>
          
          {/* Navigation Tabs */}
          <nav>
            <div className="nav nav-tabs mb-4" id="exhibition-tab" role="tablist">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
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
      </div>
    </AdminLayout>
  );
};

export default Exhibition;