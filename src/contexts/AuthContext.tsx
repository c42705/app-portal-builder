
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  isTemporaryPassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    // Initialize from localStorage if available
    const savedTheme = localStorage.getItem("darkTheme");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem("darkTheme", JSON.stringify(isDarkTheme));
  }, [isDarkTheme]);

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  /**
   * Authenticates a user with email and password
   * @param email User's email
   * @param password User's password
   */
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
      } else if (email === "newuser@example.com" && password === "temp123") {
        // Simulating a user with temporary password
        const user: User = {
          id: "3",
          name: "New User",
          email: "newuser@example.com",
          role: "user",
          isTemporaryPassword: true
        };
        
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        toast.info("Please reset your temporary password");
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

  /**
   * Logs out the current user
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  /**
   * Checks if the current user has admin role
   * @returns true if user is an admin
   */
  const isAdmin = (): boolean => {
    return user?.role === "admin";
  };

  /**
   * Updates the user's password
   * @param currentPassword Current password for verification
   * @param newPassword New password to set
   * @returns Success status
   */
  const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // In a real app, this would validate the current password and update via API
      if (user) {
        // Simulate successful update
        const updatedUser = {
          ...user,
          isTemporaryPassword: false
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Password updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
      return false;
    }
  };

  /**
   * Updates the user's profile information
   * @param updates Partial user object with fields to update
   * @returns Success status
   */
  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (user) {
        const updatedUser = {
          ...user,
          ...updates
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user,
      isAdmin,
      updateUserPassword,
      updateUserProfile,
      isDarkTheme,
      toggleTheme
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
