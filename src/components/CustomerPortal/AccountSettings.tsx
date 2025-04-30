
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Moon, Sun, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PersonalInformation from "./PersonalInformation";
import AddressBook from "./AddressBook";
import SavedConfigurations from "./SavedConfigurations";
import { MarketplaceSellerDashboard } from "./MarketplaceSellerDashboard";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { MarketplaceProvider } from "@/hooks/use-marketplace";
import { TwoFactorSetup } from "@/components/Auth/TwoFactorSetup";

type UserPreferences = {
  theme: 'light' | 'dark';
  notification_preferences: {
    order_updates: boolean;
    promotions: boolean;
    security: boolean;
  }
}

interface NotificationPreferences {
  order_updates?: boolean;
  promotions?: boolean;
  security?: boolean;
}

const AccountSettings = () => {
  const { currentUser, handleSignOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    notification_preferences: {
      order_updates: true,
      promotions: true,
      security: true
    }
  });

  useEffect(() => {
    if (currentUser) {
      fetchUserPreferences();
    }
  }, [currentUser]);

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', currentUser?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        let notificationPrefs: NotificationPreferences = {};
        
        if (typeof data.notification_preferences === 'object' && data.notification_preferences !== null) {
          notificationPrefs = data.notification_preferences as NotificationPreferences;
        } else if (typeof data.notification_preferences === 'string') {
          try {
            notificationPrefs = JSON.parse(data.notification_preferences) as NotificationPreferences;
          } catch (e) {
            console.error("Error parsing notification preferences:", e);
          }
        }
        
        setPreferences({
          theme: (data.theme as 'light' | 'dark') || 'light',
          notification_preferences: {
            order_updates: Boolean(notificationPrefs.order_updates ?? true),
            promotions: Boolean(notificationPrefs.promotions ?? true),
            security: Boolean(notificationPrefs.security ?? true)
          }
        });
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      toast.error("Failed to load preferences");
    }
  };

  const onSignOut = async () => {
    try {
      setIsLoading(true);
      await handleSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Could not sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = async (isDark: boolean) => {
    try {
      const theme = isDark ? 'dark' : 'light';
      setPreferences(prev => ({ ...prev, theme }));
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: currentUser?.id,
          theme
        });

      if (error) throw error;
      
      document.documentElement.classList.toggle('dark', isDark);
      toast.success('Theme updated');
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error('Failed to update theme');
    }
  };

  const updateNotificationPreferences = async (key: keyof typeof preferences.notification_preferences, value: boolean) => {
    try {
      const newPrefs = { 
        ...preferences.notification_preferences, 
        [key]: value 
      };
      
      setPreferences(prev => ({
        ...prev,
        notification_preferences: newPrefs
      }));
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: currentUser?.id,
          notification_preferences: newPrefs
        });

      if (error) throw error;
      toast.success('Preferences updated');
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error('Failed to update preferences');
    }
  };

  return (
    <div className="space-y-6">
      <PersonalInformation />
      <TwoFactorSetup />
      
      <AddressBook />
      
      <SavedConfigurations />
      
      <MarketplaceProvider>
        <MarketplaceSellerDashboard />
      </MarketplaceProvider>
      
      <Card className="bg-gaming-dark/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <div className="text-sm text-gray-500">
                Choose your preferred theme
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={preferences.theme === 'dark'}
                onCheckedChange={(checked) => updateTheme(checked)}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </Label>
            <div className="space-y-2">
              {Object.entries(preferences.notification_preferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="capitalize">
                    {key.replace('_', ' ')}
                  </Label>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => 
                      updateNotificationPreferences(
                        key as keyof typeof preferences.notification_preferences, 
                        checked
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-gaming-dark/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
        <Button 
          variant="destructive" 
          onClick={onSignOut}
          disabled={isLoading}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoading ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
