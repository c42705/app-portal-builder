
/**
 * Data Service for managing application data
 * Provides methods for reading and writing app configuration data
 */
import initialData from '../data/initialData.json';
import { AppConfig, AppUser, UserPermission } from '@/contexts/AppConfigContext';

// Type for the stored data structure
interface StoredData {
  apps: AppConfig[];
}

/**
 * Helper function to convert string permission to UserPermission type
 * @param permission Permission string from JSON
 * @returns Valid UserPermission type or defaults to "viewer"
 */
const convertToUserPermission = (permission: string): UserPermission => {
  if (permission === "admin" || permission === "editor" || permission === "viewer") {
    return permission as UserPermission;
  }
  console.warn(`Invalid permission "${permission}" found, defaulting to "viewer"`);
  return "viewer";
};

/**
 * Loads app data from localStorage or initializes with default data
 * @returns The stored app data
 */
export const loadData = (): StoredData => {
  try {
    const savedData = localStorage.getItem("appConfigData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Convert date strings back to Date objects and validate permissions
      if (parsedData.apps) {
        parsedData.apps = parsedData.apps.map((app: any) => ({
          ...app,
          createdAt: new Date(app.createdAt),
          updatedAt: new Date(app.updatedAt),
          // Ensure users have valid permission types
          users: app.users.map((user: any) => ({
            ...user,
            permission: convertToUserPermission(user.permission)
          }))
        }));
      }
      
      return parsedData;
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
  
  // Initialize with default data if nothing in localStorage
  return {
    apps: initialData.apps.map(app => ({
      ...app,
      createdAt: new Date(app.createdAt),
      updatedAt: new Date(app.updatedAt),
      // Ensure users have valid permission types
      users: app.users.map((user: any) => ({
        ...user,
        permission: convertToUserPermission(user.permission)
      }))
    })) as AppConfig[]
  };
};

/**
 * Saves app data to localStorage
 * @param data The data to be saved
 */
export const saveData = (data: StoredData): void => {
  try {
    localStorage.setItem("appConfigData", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

/**
 * Gets all apps from storage
 * @returns Array of app configurations
 */
export const getApps = (): AppConfig[] => {
  return loadData().apps;
};

/**
 * Adds a new app to storage
 * @param app The new app to add (without id, createdAt, updatedAt)
 * @returns The created app with generated id and timestamps
 */
export const addApp = (app: Omit<AppConfig, "id" | "createdAt" | "updatedAt">): AppConfig => {
  const data = loadData();
  const newApp: AppConfig = {
    ...app,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  data.apps.push(newApp);
  saveData(data);
  
  return newApp;
};

/**
 * Updates an existing app
 * @param id The ID of the app to update
 * @param updates Partial app data to update
 * @returns The updated app or null if not found
 */
export const updateApp = (id: string, updates: Partial<AppConfig>): AppConfig | null => {
  const data = loadData();
  const appIndex = data.apps.findIndex(app => app.id === id);
  
  if (appIndex === -1) return null;
  
  data.apps[appIndex] = {
    ...data.apps[appIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  saveData(data);
  return data.apps[appIndex];
};

/**
 * Deletes an app by ID
 * @param id The ID of the app to delete
 * @returns True if successful, false if app not found
 */
export const deleteApp = (id: string): boolean => {
  const data = loadData();
  const initialLength = data.apps.length;
  
  data.apps = data.apps.filter(app => app.id !== id);
  
  if (data.apps.length === initialLength) return false;
  
  saveData(data);
  return true;
};

/**
 * Adds a user to an app
 * @param appId The ID of the app
 * @param user The user to add (without ID)
 * @returns The updated app or null if not found
 */
export const addUserToApp = (appId: string, user: Omit<AppUser, "id">): AppConfig | null => {
  const data = loadData();
  const appIndex = data.apps.findIndex(app => app.id === appId);
  
  if (appIndex === -1) return null;
  
  // Check if user already exists
  const existingUser = data.apps[appIndex].users.find(u => u.email === user.email);
  if (existingUser) return null;
  
  // Ensure we're using a valid permission type
  const validatedUser: AppUser = { 
    ...user, 
    id: Date.now().toString(),
    permission: convertToUserPermission(user.permission as string)
  };
  
  data.apps[appIndex].users.push(validatedUser);
  data.apps[appIndex].updatedAt = new Date();
  
  saveData(data);
  return data.apps[appIndex];
};

/**
 * Removes a user from an app
 * @param appId The ID of the app
 * @param userId The ID of the user to remove
 * @returns The updated app or null if not found
 */
export const removeUserFromApp = (appId: string, userId: string): AppConfig | null => {
  const data = loadData();
  const appIndex = data.apps.findIndex(app => app.id === appId);
  
  if (appIndex === -1) return null;
  
  data.apps[appIndex].users = data.apps[appIndex].users.filter(user => user.id !== userId);
  data.apps[appIndex].updatedAt = new Date();
  
  saveData(data);
  return data.apps[appIndex];
};

/**
 * Updates a user's permission within an app
 * @param appId The ID of the app
 * @param userId The ID of the user
 * @param permission The new permission level
 * @returns The updated app or null if not found
 */
export const updateUserPermission = (
  appId: string, 
  userId: string, 
  permission: UserPermission
): AppConfig | null => {
  const data = loadData();
  const appIndex = data.apps.findIndex(app => app.id === appId);
  
  if (appIndex === -1) return null;
  
  const userIndex = data.apps[appIndex].users.findIndex(user => user.id === userId);
  if (userIndex === -1) return null;
  
  // Ensure we're using a valid permission type
  data.apps[appIndex].users[userIndex].permission = convertToUserPermission(permission as string);
  data.apps[appIndex].updatedAt = new Date();
  
  saveData(data);
  return data.apps[appIndex];
};

/**
 * Checks if a user is an admin
 * @param email The user's email
 * @returns True if the user is an admin
 */
export const isAdmin = (email: string): boolean => {
  // In a real app, this would verify from a backend auth system
  return email === "admin@example.com";
};
