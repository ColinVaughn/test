
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export const DiscordPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenDiscordPopup");
    if (!hasSeenPopup) {
      // Show popup after 5 seconds for first-time visitors
      // We use 5 seconds instead of 3 to not conflict with newsletter popup
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoinDiscord = () => {
    window.open('https://discord.gg/KGXz6Y3zuT', '_blank');
    setIsOpen(false);
    localStorage.setItem("hasSeenDiscordPopup", "true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-[#5865F2] border-[#7983f5]">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-4">
            <div className="bg-white p-3 rounded-xl">
              <Link className="h-12 w-12 text-[#5865F2]" />
            </div>
            <span className="text-2xl text-white">Join Our Gaming Community!</span>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-white/90">
            Connect with fellow gamers, get build advice, and stay updated with the latest PC gaming news!
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleJoinDiscord}
              className="bg-white text-[#5865F2] hover:bg-white/90"
            >
              Join Discord Server
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => {
                setIsOpen(false);
                localStorage.setItem("hasSeenDiscordPopup", "true");
              }}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
