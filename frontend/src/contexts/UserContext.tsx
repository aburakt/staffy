import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // For now, we'll use a mock user. In a real app, this would come from authentication
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Try to load user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Set a default mock user for demo purposes
      const mockUser: User = {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'Administrator',
      };
      setUser(mockUser);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    // In a real app, this would redirect to login page
    // For now, just refresh to reset the state
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
