
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, database } from '@/config/firebase';
import { ref, set } from 'firebase/database';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const storeUserData = async (user: User) => {
    try {
      const userRef = ref(database, `Users/${user.uid}`);
      const userData = {
        email: user.email || '',
        image: user.photoURL || '',
        name: user.displayName || user.email?.split('@')[0] || 'User'
      };
      await set(userRef, userData);
      console.log('User data stored successfully:', userData);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      await storeUserData(result.user);
    }
    // Check if user came from auth page trying to access ArcTrack Central
    if (location.pathname === '/auth') {
      navigate('/arctrack-central');
    } else {
      navigate('/');
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
      await updateProfile(result.user, { displayName });
      // Reload user to get updated profile
      await result.user.reload();
      const updatedUser = auth.currentUser;
      if (updatedUser) {
        await storeUserData(updatedUser);
      }
    }
    // Check if user came from auth page trying to access ArcTrack Central
    if (location.pathname === '/auth') {
      navigate('/arctrack-central');
    } else {
      navigate('/');
    }
  };

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user) {
      await storeUserData(result.user);
    }
    // Check if user came from auth page trying to access ArcTrack Central
    if (location.pathname === '/auth') {
      navigate('/arctrack-central');
    } else {
      navigate('/');
    }
  };

  const logout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (displayName: string) => {
    if (currentUser) {
      await updateProfile(currentUser, { displayName });
      await storeUserData(currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Store/update user data whenever auth state changes
        await storeUserData(user);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
