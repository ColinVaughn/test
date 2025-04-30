
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AuthHeader } from "./AuthHeader";

interface UserProfileProps {
  email: string;
  isLoading: boolean;
  onSignOut: () => void;
}

export function UserProfile({ email, isLoading, onSignOut }: UserProfileProps) {
  return (
    <div className="w-full max-w-md space-y-8 bg-gaming-dark/30 p-8 rounded-lg border border-gaming-light-gray/20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">
          Currently Signed In
        </h2>
        <p className="text-gray-400 mt-2">
          Signed in as {email}
        </p>
      </div>

      <div className="space-y-6">
        <Button
          onClick={onSignOut}
          className="w-full bg-red-600 hover:bg-red-700"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign Out"}
        </Button>

        <div className="text-center">
          <Link
            to="/"
            className="text-gaming-blue hover:text-gaming-blue/80"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
