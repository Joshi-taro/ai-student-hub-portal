
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    
    // Redirect based on user role
    if (user) {
      navigate("/dashboard"); // All roles go to dashboard first
    } else {
      navigate("/login");
    }
  }, [user, navigate, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};

export default Index;
