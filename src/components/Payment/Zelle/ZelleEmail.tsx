
import { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ZelleEmailProps {
  zelleEmail: string;
}

export const ZelleEmail = ({ zelleEmail }: ZelleEmailProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(zelleEmail);
      setCopied(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy email");
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <code className="bg-black/30 px-3 py-1.5 rounded text-gaming-blue flex-1">
        {zelleEmail}
      </code>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyEmail}
        className="min-w-[100px]"
      >
        {copied ? (
          <CheckIcon className="w-4 h-4 mr-2" />
        ) : (
          <CopyIcon className="w-4 h-4 mr-2" />
        )}
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
};
