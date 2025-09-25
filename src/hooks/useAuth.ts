import { useState, useEffect } from "react";

// Mock user data - replace with actual auth logic
interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

const mockUser: User = {
  id: "1",
  name: "Sree R One",
  email: "sree@example.com",
  isAuthenticated: true,
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual login logic
    console.log("Login attempt for:", email);
    // Password would be sent to API in real implementation
    void password; // Acknowledge parameter for future use
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
  };
};
