
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

const CrispChat = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initialize Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "74537b53-249a-404d-8677-c1cca78388dd";

    // Load Crisp script
    (function() {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();

    // Ensure Crisp is properly initialized before trying to configure it
    const configureCrisp = () => {
      // Configure Crisp
      window.$crisp.push(["set", "color:theme", "#9b87f5"]); // Using our gaming purple theme
      window.$crisp.push(["set", "website:name", "BattleforgePC"]);

      // Set user information if logged in
      if (currentUser) {
        window.$crisp.push(["set", "user:email", currentUser.email]);
        window.$crisp.push(["set", "user:nickname", currentUser.email?.split('@')[0]]);
        
        // Set additional session data
        window.$crisp.push(["set", "session:data", [[
          ["User ID", currentUser.id],
          ["Platform", "Web"],
          ["Page", window.location.pathname],
          ["Login Status", "Authenticated"]
        ]]]);
      } else {
        // Set session data for anonymous users
        window.$crisp.push(["set", "session:data", [[
          ["Platform", "Web"],
          ["Page", window.location.pathname],
          ["Login Status", "Anonymous"]
        ]]]);
      }

      // Show chat bubble
      window.$crisp.push(["do", "chat:show"]);

      // Set initial message
      window.$crisp.push(["set", "message:text", [
        ["Welcome to BattleforgePC! 🎮 How can we help you today?"]
      ]]);

      // Handle chat opened
      window.$crisp.push(["on", "chat:opened", function() {
        console.log("Chat opened");
      }]);

      // Handle chat closed
      window.$crisp.push(["on", "chat:closed", function() {
        console.log("Chat closed");
      }]);
    };

    // Check if Crisp is ready every 500ms
    const interval = setInterval(() => {
      if (window.$crisp && typeof window.$crisp.push === 'function') {
        configureCrisp();
        clearInterval(interval);
      }
    }, 500);

    // Clean up on component unmount
    return () => {
      clearInterval(interval);
      window.$crisp = [];
      const scriptElement = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [currentUser]); // Added currentUser to dependency array

  return null;
};

export default CrispChat;
