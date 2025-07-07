
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Database, Users, User, LogOut } from 'lucide-react';

const ArcTrackCentral = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const dashboardOptions = [
    {
      title: 'Tracking Console',
      description: 'Monitor and track your devices in real-time',
      icon: Monitor,
      path: '/tracking-console',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Database and Analytics',
      description: 'Access data insights and analytics',
      icon: Database,
      path: '/database-analytics',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Projects and Users',
      description: 'Manage your projects and team members',
      icon: Users,
      path: '/projects-users',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'My ArcTrack',
      description: 'Personal account settings and preferences',
      icon: User,
      path: '/my-arctrack',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const handleOptionClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">ArcTrack Central</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {currentUser.displayName || currentUser.email}
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {dashboardOptions.map((option) => (
            <Card 
              key={option.title}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
              onClick={() => handleOptionClick(option.path)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full ${option.color} flex items-center justify-center mx-auto mb-4`}>
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className={`w-full ${option.color} text-white`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionClick(option.path);
                  }}
                >
                  Access {option.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArcTrackCentral;
