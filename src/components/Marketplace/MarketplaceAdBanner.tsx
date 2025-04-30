
import { useAuth } from '@/hooks/useAuth';
import { useMarketplaceAds } from '@/hooks/use-marketplace-ads';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react'; // Replace Ad with Megaphone

export const MarketplaceAdBanner = () => {
  const { currentUser } = useAuth();
  const { isOptedIn, optInToAds } = useMarketplaceAds();

  if (isOptedIn) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-green-500" />
          <span className="text-green-500">You're saving 2% on your orders with ads enabled!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gaming-dark/20 border border-gaming-blue/20 rounded-lg p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-gaming-blue" />
        <span>
          {currentUser ? (
            'Opt into ads to save 2% on your orders!'
          ) : (
            <span>
              <Link to="/auth" className="text-gaming-blue hover:underline">Sign in</Link>
              {' '}and opt into ads to save 2% on your orders!
            </span>
          )}
        </span>
      </div>
      {currentUser && (
        <Button
          onClick={optInToAds}
          className="bg-gaming-blue hover:bg-gaming-blue/90"
        >
          Enable Ads
        </Button>
      )}
    </div>
  );
};
