
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

type AuthMode = 'login' | 'signup' | 'forgot-password';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onToggleMode={() => setMode('signup')}
            onForgotPassword={() => setMode('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignupForm onToggleMode={() => setMode('login')} />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm onBackToLogin={() => setMode('login')} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {renderForm()}
      </div>
    </div>
  );
};

export default Auth;
