import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HealthCheck.css';

interface HealthStatus {
  message: string;
  environment: string;
  timestamp: string;
}

interface ErrorInfo {
  message: string;
  error?: string;
}

const HealthCheck: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    const checkHealth = async (): Promise<void> => {
      try {
        const res = await axios.get<HealthStatus>('/api/v1/health');
        setHealthStatus(res.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data || { message: err.message });
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  if (loading) {
    return <div className="health-check-loading">Checking database health...</div>;
  }

  if (error) {
    return (
      <div className="health-check-alert health-check-error">
        <h4>Database Connection Error</h4>
        <p>{error.message}</p>
        {error.error && <p className="error-details">Error details: {error.error}</p>}
      </div>
    );
  }

  return (
    <div className="health-check-alert health-check-success">
      <h4>Database Status: Healthy</h4>
      <p>{healthStatus?.message}</p>
      <p>Environment: {healthStatus?.environment}</p>
      <p>Last checked: {new Date(healthStatus?.timestamp || '').toLocaleString()}</p>
    </div>
  );
};

export default HealthCheck;
