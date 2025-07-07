
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Database, Users, User, LogOut } from 'lucide-react';

const ArcTrackCentral = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    {
      title: 'Tracking Console',
      description: 'Real-time device tracking and monitoring',
      icon: Monitor,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/tracking-console'
    },
    {
      title: 'Database and Analytics',
      description: 'Data insights and analytics dashboard',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/database-analytics'
    },
    {
      title: 'Projects, Users and Devices',
      description: 'Manage projects, users and device onboarding',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/projects-users-devices'
    },
    {
      title: 'My ArcTrack',
      description: 'Personal account settings and preferences',
      icon: User,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/my-arctrack'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ArcTrack Central</h1>
            <p className="mt-2 text-gray-600">Welcome back, {currentUser.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => navigate(item.route)}
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-4`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Access {item.title} →
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
