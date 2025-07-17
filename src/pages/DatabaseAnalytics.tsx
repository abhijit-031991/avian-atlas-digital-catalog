
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DatabaseAnalyticsLayout from '@/components/database-analytics/DatabaseAnalyticsLayout';

const DatabaseAnalytics = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  return <DatabaseAnalyticsLayout />;
};

export default DatabaseAnalytics;
