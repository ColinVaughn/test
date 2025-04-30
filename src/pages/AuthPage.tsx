
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthHeader } from "@/components/Auth/AuthHeader";
import { AuthLoginForm } from "@/components/Auth/AuthLoginForm";
import { UserProfile } from "@/components/Auth/UserProfile";

const AuthPage = () => {
  const { currentUser, isLoading, handleSignOut } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gaming-darker flex flex-col items-center justify-center p-4">
      <AuthHeader />
      
      {currentUser ? (
        <UserProfile 
          email={currentUser.email || ''} 
          isLoading={isLoading}
          onSignOut={handleSignOut}
        />
      ) : (
        <AuthLoginForm 
          isLogin={isLogin} 
          setIsLogin={setIsLogin} 
        />
      )}
    </div>
  );
};

export default AuthPage;
