
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/study-helper" element={<StudyHelper />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </DarkModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
