
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would make an API call to authenticate
      
      // For demo purposes, we'll validate using some hardcoded credentials
      if (email === "admin@example.com" && password === "password") {
        const user: User = {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          avatar: "/placeholder.svg",
          role: "admin"
        };
        
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Welcome back, ${user.name}`);
      } else if (email === "user@example.com" && password === "password") {
        const user: User = {
          id: "2",
          name: "Regular User",
          email: "user@example.com",
          role: "user"
        };
        
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Welcome back, ${user.name}`);
      } else {
        toast.error("Invalid credentials");
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using this context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
