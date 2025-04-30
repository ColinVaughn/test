
import { Card, CardContent } from "@/components/ui/card";

const PrebuiltTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Michael R.",
      location: "Seattle, WA",
      system: "BattleForge Pro",
      quote: "After my BattleForge Pro arrived, I was blown away by the build quality. The cable management is immaculate, and the performance is exactly what I needed for streaming while playing Warzone at high framerates.",
      rating: 5,
    },
    {
      id: 2,
      name: "Jessica T.",
      location: "Austin, TX",
      system: "BattleForge Elite",
      quote: "As a professional 3D artist, I needed a system that could handle complex rendering tasks. My BattleForge Elite cuts render times in half compared to my previous workstation. Worth every penny!",
      rating: 5,
    },
    {
      id: 3,
      name: "Daniel K.",
      location: "Chicago, IL",
      system: "BattleForge Starter",
      quote: "Perfect entry-level gaming PC for my son. Setup was incredibly easy and the performance is great for the price. Customer service was helpful when I had questions about upgrading in the future.",
      rating: 5,
    },
    {
      id: 4,
      name: "Aisha M.",
      location: "Portland, OR",
      system: "BattleForge Pro",
      quote: "I've built PCs before but decided to save time with a pre-built. No regrets! The component quality is excellent, and everything was perfectly installed. Temperatures stay cool even during long gaming sessions.",
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-yellow-400" : "text-gray-500"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 15.585l-5.994 3.196 1.146-6.789L.744 7.651l6.8-.998L10 0l2.456 6.653 6.8.998-4.408 4.341 1.146 6.789L10 15.585z"
            clipRule="evenodd"
          />
        </svg>
      ));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gaming-dark to-gaming-darker">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Customer Testimonials</h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Don't just take our word for it - hear from real customers who have experienced 
          the BattleforgePC difference with our pre-built gaming systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="gaming-card bg-gaming-dark border border-gaming-light-gray/40">
              <CardContent className="pt-8 pb-8">
                <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
                <blockquote className="text-lg mb-6 text-gray-200 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-gaming-blue text-sm">{testimonial.location} | {testimonial.system}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-2xl font-bold text-gaming-blue mb-4">Verified by Trustpilot</p>
          <div className="flex justify-center items-center gap-1">
            {renderStars(5)}
            <span className="text-white ml-2">4.9/5 based on 350+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrebuiltTestimonials;
