
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DarkModeProvider } from "@/hooks/useDarkMode";

import AppLayout from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import Schedule from "@/pages/Schedule";
import Grades from "@/pages/Grades";
import Announcements from "@/pages/Announcements";
import Fees from "@/pages/Fees";
import Attendance from "@/pages/Attendance";
import StudyHelper from "@/pages/StudyHelper";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DarkModeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                } 
              />
              <Route 
                path="/courses" 
                element={
                  <AppLayout>
                    <Courses />
                  </AppLayout>
                } 
              />
              <Route 
                path="/schedule" 
                element={
                  <AppLayout>
                    <Schedule />
                  </AppLayout>
                } 
              />
              <Route 
                path="/grades" 
                element={
                  <AppLayout>
                    <Grades />
                  </AppLayout>
                } 
              />
              <Route 
                path="/announcements" 
                element={
                  <AppLayout>
                    <Announcements />
                  </AppLayout>
                } 
              />
              <Route 
                path="/fees" 
                element={
                  <AppLayout>
                    <Fees />
                  </AppLayout>
                } 
              />
              <Route 
                path="/attendance" 
                element={
                  <AppLayout>
                    <Attendance />
                  </AppLayout>
                } 
              />
              <Route 
                path="/study-helper" 
                element={
                  <AppLayout>
                    <StudyHelper />
                  </AppLayout>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </DarkModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
