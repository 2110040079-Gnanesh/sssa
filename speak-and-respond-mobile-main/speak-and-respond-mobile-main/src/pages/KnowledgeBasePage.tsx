
import React, { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import KnowledgeBase from "@/components/KnowledgeBase";

const KnowledgeBasePage = () => {
  const navigate = useNavigate();
  const { user, loading, requireAuth } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Redirect to auth if not logged in and not loading
  if (!loading && !user) {
    return <Navigate to="/auth" />;
  }

  // If loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="flex space-x-2">
          {Array(3).fill(0).map((_, i) => (
            <div 
              key={i}
              className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
              style={{
                animation: 'bounce 1.4s infinite ease-in-out',
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background/95 to-background/90 p-3 md:p-4">
      <Header 
        user={user}
        onViewHistory={() => navigate('/dashboard')}
        historyVisible={false}
      />

      <div className="max-w-3xl mx-auto w-full mt-4">
        <KnowledgeBase userId={user?.id} />
      </div>
      
      <footer className="mt-4 text-xs text-center text-muted-foreground py-2">
        <p>© 2025 MeigdAI Interview Assistant. Professional interview responses powered by AI.</p>
      </footer>
    </div>
  );
};

export default KnowledgeBasePage;
