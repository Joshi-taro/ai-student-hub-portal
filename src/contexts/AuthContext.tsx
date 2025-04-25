
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePic?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

// Mock user data for development
const MOCK_USERS: User[] = [
  {
    id: 'stu1',
    name: 'John Student',
    email: 'student@university.edu',
    role: 'student',
    profilePic: '/placeholder.svg'
  },
  {
    id: 'fac1',
    name: 'Dr. Jane Faculty',
    email: 'faculty@university.edu',
    role: 'faculty',
    profilePic: '/placeholder.svg'
  },
  {
    id: 'adm1',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
    profilePic: '/placeholder.svg'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for saved user in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('uniPortalUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('uniPortalUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo: simple authentication with mock data
    const matchedUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (matchedUser && password === 'password') { // For demo, any password works
      setUser(matchedUser);
      localStorage.setItem('uniPortalUser', JSON.stringify(matchedUser));
      toast.success(`Welcome back, ${matchedUser.name}!`);
    } else {
      toast.error('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('uniPortalUser');
    toast.success('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
