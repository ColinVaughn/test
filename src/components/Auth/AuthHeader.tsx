
import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";

export function AuthHeader() {
  return (
    <Link to="/" className="flex items-center gap-2 mb-8">
      <Cpu className="h-8 w-8 text-gaming-blue" />
      <span className="text-2xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-gaming-blue to-gaming-purple">
        BattleforgePC
      </span>
    </Link>
  );
}
