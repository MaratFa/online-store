import React from 'react';
import HealthCheck from '../components/HealthCheck';
import './HealthCheckPage.css';

const HealthCheckPage: React.FC = () => {
  return (
    <div className="health-check-container">
      <h1>Database Health Check</h1>
      <p>This page checks the connection status of the database.</p>
      <HealthCheck />
    </div>
  );
};

export default HealthCheckPage;