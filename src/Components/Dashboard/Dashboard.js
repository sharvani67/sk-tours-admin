import React from 'react'
import AdminLayout from '../../Shared/Sidebar/Sidebar'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="content-wrapper">
        <h1>Dashboard</h1>
        <div className="dashboard-content">
          <p>Welcome to your dashboard! This is the main content area.</p>
          
          {/* Add your dashboard widgets/components here */}
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <h3 className="card-text">1,234</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Orders</h5>
                  <h3 className="card-text">567</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Revenue</h5>
                  <h3 className="card-text">$12,345</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Pending</h5>
                  <h3 className="card-text">23</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard