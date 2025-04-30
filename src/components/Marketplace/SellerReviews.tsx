
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { SellerReview } from '@/types/rpcFunctions';

interface SellerReviewsProps {
  reviews: SellerReview[] | null | undefined;
}

export const SellerReviews = ({ reviews }: SellerReviewsProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-4 w-4 text-yellow-500" />);
      } else {
        stars.push(<StarOff key={i} className="h-4 w-4 text-gray-500" />);
      }
    }

    return stars;
  };

  // Ensure reviews is an array before attempting to map over it
  const reviewsArray = Array.isArray(reviews) ? reviews : [];

  return (
    <Card className="bg-gaming-dark/30">
      <CardHeader>
        <CardTitle className="text-xl">Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviewsArray.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviewsArray.map((review) => (
              <div key={review.id} className="border-b border-gaming-dark/50 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-400">
                    by {review.customer.email}
                  </span>
                </div>
                {review.review_text && (
                  <p className="text-sm text-gray-300">{review.review_text}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
