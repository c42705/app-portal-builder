
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppConfigProvider } from "./contexts/AppConfigContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AppList from "./pages/AppList";
import AppCreate from "./pages/AppCreate";
import AppEdit from "./pages/AppEdit";
import AppUsers from "./pages/AppUsers";
import Portal from "./pages/Portal";
import NotFound from "./pages/NotFound";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Admin routes (protected) */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/apps" element={
                  <ProtectedRoute>
                    <AppList />
                  </ProtectedRoute>
                } />
                <Route path="/admin/apps/new" element={
                  <ProtectedRoute>
                    <AppCreate />
                  </ProtectedRoute>
                } />
                <Route path="/admin/apps/edit/:id" element={
                  <ProtectedRoute>
                    <AppEdit />
                  </ProtectedRoute>
                } />
                <Route path="/admin/apps/:id/users" element={
                  <ProtectedRoute>
                    <AppUsers />
                  </ProtectedRoute>
                } />
                
                {/* Portal route (protected) */}
                <Route path="/portal/:id" element={
                  <ProtectedRoute>
                    <Portal />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AppConfigProvider>
        </AuthProvider>
      </TooltipProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
