import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navigation } from "@/components/layout/Navigation";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import MerchantAuth from "./pages/MerchantAuth";
import Dashboard from "./pages/Dashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantSignup from "./pages/MerchantSignup";
import AdminDashboard from "./pages/AdminDashboard";
import LogoContest from "./pages/LogoContest";
import VoteOnDesigns from "./pages/VoteOnDesigns";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/merchant-auth" element={<MerchantAuth />} />
              <Route path="/logo-contest" element={<LogoContest />} />
              <Route path="/vote-on-designs" element={<VoteOnDesigns />} />
              <Route path="/merchant-signup" element={<MerchantSignup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="user">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/merchant" 
                element={
                  <ProtectedRoute requiredRole="merchant">
                    <MerchantDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
