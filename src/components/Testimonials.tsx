
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Professional Gamer",
      quote: "My BattleForge PC gives me the competitive edge I need. Zero frame drops even during intense tournament matches.",
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "3D Designer",
      quote: "The workstation I customized handles my rendering tasks flawlessly. Cut my project times in half!",
      rating: 5,
    },
    {
      id: 3,
      name: "Marcus Lee",
      role: "Twitch Streamer",
      quote: "Streaming at 4K while playing CPU-intensive games used to be impossible. Not anymore with my BattleForge system.",
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
    <section className="py-16 bg-gradient-to-b from-gaming-darker to-gaming-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">What Our Customers Say</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            Don't just take our word for it - hear from gamers, creators, and professionals who rely on BattleForge systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="gaming-card bg-gaming-dark border border-gaming-light-gray/40">
              <CardContent className="pt-8 pb-8">
                <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
                <blockquote className="text-lg mb-6 text-gray-200 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-gaming-blue text-sm">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
