
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatbotButton } from "@/components/ChatbotButton";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/toaster";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const [showChatbot, setShowChatbot] = useState(false);

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {children}
          </main>
          {/* ChatbotButton will be shown or hidden based on state */}
          <ChatbotButton initialState={showChatbot} />
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
