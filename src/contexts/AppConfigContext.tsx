
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Type definitions
export type UserPermission = "admin" | "viewer" | "editor";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permission: UserPermission;
}

export interface AppConfig {
  id: string;
  title: string;
  description: string;
  logoUrl: string;
  url: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  users: AppUser[];
  isActive: boolean;
}

interface AppConfigContextType {
  apps: AppConfig[];
  currentApp: AppConfig | null;
  setCurrentApp: (app: AppConfig | null) => void;
  addApp: (app: Omit<AppConfig, "id" | "createdAt" | "updatedAt">) => void;
  updateApp: (id: string, updates: Partial<AppConfig>) => void;
  deleteApp: (id: string) => void;
  addUserToApp: (appId: string, user: Omit<AppUser, "id">) => void;
  removeUserFromApp: (appId: string, userId: string) => void;
  updateUserPermission: (appId: string, userId: string, permission: UserPermission) => void;
  isAdmin: (email: string) => boolean;
}

// Mock data for initial apps
const initialApps: AppConfig[] = [
  {
    id: "1",
    title: "Customer Portal",
    description: "A portal for customers to manage their accounts and view products",
    logoUrl: "/placeholder.svg",
    url: "https://customer.example.com",
    createdBy: "admin@example.com",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20"),
    users: [
      {
        id: "u1",
        name: "Admin User",
        email: "admin@example.com",
        avatar: "/placeholder.svg",
        permission: "admin"
      },
      {
        id: "u2",
        name: "John Viewer",
        email: "john@example.com",
        permission: "viewer"
      }
    ],
    isActive: true
  },
  {
    id: "2",
    title: "Employee Dashboard",
    description: "Internal dashboard for employee resources and tools",
    logoUrl: "/placeholder.svg",
    url: "https://employees.example.com",
    createdBy: "admin@example.com",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-05-18"),
    users: [
      {
        id: "u1",
        name: "Admin User",
        email: "admin@example.com",
        avatar: "/placeholder.svg",
        permission: "admin"
      },
      {
        id: "u3",
        name: "Sarah Editor",
        email: "sarah@example.com",
        permission: "editor"
      }
    ],
    isActive: true
  }
];

// Create context
const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

// Provider component
export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<AppConfig[]>(() => {
    // Try to load from localStorage
    const savedApps = localStorage.getItem("appConfigs");
    return savedApps ? JSON.parse(savedApps) : initialApps;
  });
  
  const [currentApp, setCurrentApp] = useState<AppConfig | null>(null);

  // Save to localStorage whenever apps change
  useEffect(() => {
    localStorage.setItem("appConfigs", JSON.stringify(apps));
  }, [apps]);

  const addApp = (newApp: Omit<AppConfig, "id" | "createdAt" | "updatedAt">) => {
    const app: AppConfig = {
      ...newApp,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setApps([...apps, app]);
    toast.success("App created successfully");
  };

  const updateApp = (id: string, updates: Partial<AppConfig>) => {
    setApps(apps.map(app => 
      app.id === id 
        ? { ...app, ...updates, updatedAt: new Date() } 
        : app
    ));
    
    // Update current app if it's the one being updated
    if (currentApp?.id === id) {
      setCurrentApp({ ...currentApp, ...updates, updatedAt: new Date() });
    }
    
    toast.success("App updated successfully");
  };

  const deleteApp = (id: string) => {
    setApps(apps.filter(app => app.id !== id));
    
    // Clear current app if it's the one being deleted
    if (currentApp?.id === id) {
      setCurrentApp(null);
    }
    
    toast.success("App deleted successfully");
  };

  const addUserToApp = (appId: string, user: Omit<AppUser, "id">) => {
    setApps(apps.map(app => {
      if (app.id === appId) {
        // Check if user already exists
        const existingUser = app.users.find(u => u.email === user.email);
        if (existingUser) {
          toast.error("User already exists in this app");
          return app;
        }
        
        const newUser: AppUser = { ...user, id: Date.now().toString() };
        return { 
          ...app, 
          users: [...app.users, newUser],
          updatedAt: new Date()
        };
      }
      return app;
    }));
    
    toast.success("User added successfully");
  };

  const removeUserFromApp = (appId: string, userId: string) => {
    setApps(apps.map(app => {
      if (app.id === appId) {
        return { 
          ...app, 
          users: app.users.filter(user => user.id !== userId),
          updatedAt: new Date()
        };
      }
      return app;
    }));
    
    toast.success("User removed successfully");
  };

  const updateUserPermission = (appId: string, userId: string, permission: UserPermission) => {
    setApps(apps.map(app => {
      if (app.id === appId) {
        return { 
          ...app, 
          users: app.users.map(user => 
            user.id === userId ? { ...user, permission } : user
          ),
          updatedAt: new Date()
        };
      }
      return app;
    }));
    
    toast.success("User permission updated");
  };

  const isAdmin = (email: string) => {
    // In a real app, this would verify from a backend auth system
    return email === "admin@example.com";
  };

  return (
    <AppConfigContext.Provider value={{
      apps,
      currentApp,
      setCurrentApp,
      addApp,
      updateApp,
      deleteApp,
      addUserToApp,
      removeUserFromApp,
      updateUserPermission,
      isAdmin
    }}>
      {children}
    </AppConfigContext.Provider>
  );
};

// Custom hook for using this context
export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error("useAppConfig must be used within an AppConfigProvider");
  }
  return context;
};
