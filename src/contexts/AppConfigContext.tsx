
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import * as dataService from "@/services/dataService";

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

// Create context
const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

/**
 * Provider component for app configuration context
 * Uses the data service to manage app data
 */
export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [currentApp, setCurrentApp] = useState<AppConfig | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedApps = dataService.getApps();
    setApps(loadedApps);
  }, []);

  /**
   * Adds a new app
   * @param newApp App configuration without id and timestamps
   */
  const addApp = (newApp: Omit<AppConfig, "id" | "createdAt" | "updatedAt">) => {
    const app = dataService.addApp(newApp);
    setApps([...apps, app]);
    toast.success("App created successfully");
  };

  /**
   * Updates an existing app
   * @param id App ID
   * @param updates Partial app data to update
   */
  const updateApp = (id: string, updates: Partial<AppConfig>) => {
    const updatedApp = dataService.updateApp(id, updates);
    
    if (updatedApp) {
      setApps(apps.map(app => app.id === id ? updatedApp : app));
      
      // Update current app if it's the one being updated
      if (currentApp?.id === id) {
        setCurrentApp(updatedApp);
      }
      
      toast.success("App updated successfully");
    } else {
      toast.error("App not found");
    }
  };

  /**
   * Deletes an app by ID
   * @param id App ID to delete
   */
  const deleteApp = (id: string) => {
    const success = dataService.deleteApp(id);
    
    if (success) {
      setApps(apps.filter(app => app.id !== id));
      
      // Clear current app if it's the one being deleted
      if (currentApp?.id === id) {
        setCurrentApp(null);
      }
      
      toast.success("App deleted successfully");
    } else {
      toast.error("App not found");
    }
  };

  /**
   * Adds a user to an app
   * @param appId App ID
   * @param user User data without ID
   */
  const addUserToApp = (appId: string, user: Omit<AppUser, "id">) => {
    const updatedApp = dataService.addUserToApp(appId, user);
    
    if (updatedApp) {
      setApps(apps.map(app => app.id === appId ? updatedApp : app));
      
      // Update current app if it's the one being modified
      if (currentApp?.id === appId) {
        setCurrentApp(updatedApp);
      }
      
      toast.success("User added successfully");
    } else {
      toast.error("User already exists or app not found");
    }
  };

  /**
   * Removes a user from an app
   * @param appId App ID
   * @param userId User ID to remove
   */
  const removeUserFromApp = (appId: string, userId: string) => {
    const updatedApp = dataService.removeUserFromApp(appId, userId);
    
    if (updatedApp) {
      setApps(apps.map(app => app.id === appId ? updatedApp : app));
      
      // Update current app if it's the one being modified
      if (currentApp?.id === appId) {
        setCurrentApp(updatedApp);
      }
      
      toast.success("User removed successfully");
    } else {
      toast.error("App not found");
    }
  };

  /**
   * Updates a user's permission within an app
   * @param appId App ID
   * @param userId User ID
   * @param permission New permission level
   */
  const updateUserPermission = (appId: string, userId: string, permission: UserPermission) => {
    const updatedApp = dataService.updateUserPermission(appId, userId, permission);
    
    if (updatedApp) {
      setApps(apps.map(app => app.id === appId ? updatedApp : app));
      
      // Update current app if it's the one being modified
      if (currentApp?.id === appId) {
        setCurrentApp(updatedApp);
      }
      
      toast.success("User permission updated");
    } else {
      toast.error("User or app not found");
    }
  };

  /**
   * Checks if a user has admin permissions
   * @param email User email
   * @returns True if user is an admin
   */
  const isAdmin = (email: string) => {
    return dataService.isAdmin(email);
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

/**
 * Custom hook for using the app config context
 * @returns App configuration context
 * @throws Error if used outside provider
 */
export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error("useAppConfig must be used within an AppConfigProvider");
  }
  return context;
};
