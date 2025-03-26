
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppConfigProvider } from "./contexts/AppConfigContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AppList from "./pages/AppList";
import AppCreate from "./pages/AppCreate";
import AppEdit from "./pages/AppEdit";
import AppUsers from "./pages/AppUsers";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Portal from "./pages/Portal";
import NotFound from "./pages/NotFound";

// Protected route component with role-based access
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { isAuthenticated, isLoading, user, isAdmin } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Check for temporary password
  if (isAuthenticated && user?.isTemporaryPassword) {
    return <Navigate to="/admin/settings" />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If it's an admin-only route and user is not admin
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/admin/apps" />;
  }
  
  return <>{children}</>;
};

// Add framer-motion
import { MotionConfig } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <AuthProvider>
          <AppConfigProvider>
            <NotificationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Admin-only routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/apps/new" element={
                    <ProtectedRoute adminOnly>
                      <AppCreate />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/apps/edit/:id" element={
                    <ProtectedRoute adminOnly>
                      <AppEdit />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/apps/:id/users" element={
                    <ProtectedRoute adminOnly>
                      <AppUsers />
                    </ProtectedRoute>
                  } />
                  
                  {/* Regular user routes (accessible by all) */}
                  <Route path="/admin/apps" element={
                    <ProtectedRoute>
                      <AppList />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/notifications" element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/portal/:id" element={
                    <ProtectedRoute>
                      <Portal />
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect from admin home to apps for non-admin users */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <Navigate to="/admin/apps" />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </NotificationProvider>
          </AppConfigProvider>
        </AuthProvider>
      </TooltipProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
