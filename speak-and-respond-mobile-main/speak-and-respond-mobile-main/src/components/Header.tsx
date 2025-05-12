
import React from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Eye, LogOut, Book, Home } from "lucide-react";

interface HeaderProps {
  user: any | null;
  onViewHistory: () => void;
  historyVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onViewHistory, historyVisible }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3">
      <div className="text-center sm:text-left">
        <h1 className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
          MeigdAI Interview Assistant
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Professional interview responses powered by AI
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
        {user && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 h-8 text-xs bg-black/20 border-white/5"
              onClick={() => navigate("/dashboard")}
            >
              <Home size={14} />
              Dashboard
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 h-8 text-xs bg-black/20 border-white/5"
              onClick={() => navigate("/knowledge-base")}
            >
              <Book size={14} />
              Knowledge Base
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 h-8 text-xs bg-black/20 border-white/5"
              onClick={onViewHistory}
            >
              <Eye size={14} />
              {historyVisible ? "Hide History" : "History"}
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:block bg-blue-500/10 rounded-md px-2 py-1">
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut} 
                className="h-8 text-xs bg-black/20 border-white/5"
              >
                <LogOut size={14} className="mr-1" />
                Sign Out
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
