
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, Award, Shield, Users, Monitor, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gaming-darker">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gaming-blue/5"></div>
            <div className="absolute h-full w-1/3 top-0 left-1/3 bg-gaming-purple/5 blur-3xl rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-gaming-blue/20 text-gaming-blue mb-4 py-1">About Us</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Crafting Gaming Excellence Since 2024
              </h1>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                BattleforgePC was born from a passion for gaming and a vision to make high-performance 
                custom PC building accessible to everyone.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-20 bg-gaming-dark">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
BattleforgePC started in 2024 as a small, two-person team built on a shared love for gaming and custom PCs. Founded by Colin and Eva, we combined our strengths—Colin handles the building, Eva leads the marketing—to create high-quality, personalized gaming setups for players who care about performance and style.
                  </p>
                  <p>
                    What started as a passion project quickly grew into a trusted name in the custom PC industry. 
                    Our commitment to quality, attention to detail, and exceptional customer service has allowed 
                    us to build a community of loyal customers who trust us with their gaming dreams.
                  </p>
                  <p>
Today, we're still a small team working out of a modest space, but we've shipped over 500 custom PCs with only 2 ever damaged in transit. Every system is built by hand with the same care and precision we started with, and our customer satisfaction rate speaks for itself—over 98% of our buyers say they'd recommend BattleforgePC to a friend.
                  </p>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button asChild className="bg-gaming-blue hover:bg-gaming-blue/80">
                    <Link to="/prebuilt">Explore Our PCs</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-gaming-blue/50 hover:border-gaming-blue hover:bg-gaming-blue/10">
                    <Link to="/support">Contact Us</Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gaming-blue/20 to-gaming-purple/20 rounded-lg transform -rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1603481546238-487163a25a24?q=80&w=2670&auto=format" 
                  alt="BattleforgePC Workshop" 
                  className="rounded-lg shadow-xl relative transform rotate-3"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6 text-white">Our Core Values</h2>
              <p className="text-gray-300">
                These principles guide everything we do, from system design to customer support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gaming-dark p-8 rounded-lg border border-gaming-light-gray/20">
                <div className="bg-gaming-blue/20 p-4 inline-block rounded-full mb-6">
                  <Award className="h-8 w-8 text-gaming-blue" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Quality Without Compromise</h3>
                <p className="text-gray-300">
                  We source only the most reliable components from trusted brands and partners.
                  Every system undergoes rigorous testing before shipping.
                </p>
              </div>
              
              <div className="bg-gaming-dark p-8 rounded-lg border border-gaming-light-gray/20">
                <div className="bg-gaming-purple/20 p-4 inline-block rounded-full mb-6">
                  <Users className="h-8 w-8 text-gaming-purple" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Customer-First Mindset</h3>
                <p className="text-gray-300">
                  We listen, advise, and support our customers throughout their journey with us,
                  from initial consultation to post-purchase support.
                </p>
              </div>
              
              <div className="bg-gaming-dark p-8 rounded-lg border border-gaming-light-gray/20">
                <div className="bg-gaming-red/20 p-4 inline-block rounded-full mb-6">
                  <Shield className="h-8 w-8 text-gaming-red" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Transparency & Integrity</h3>
                <p className="text-gray-300">
                  Clear pricing, honest recommendations, and straightforward communication 
                  are the foundation of our relationships with customers.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20 bg-gaming-dark">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6 text-white">Meet Our Team</h2>
              <p className="text-gray-300">
                The passionate experts behind BattleforgePC who bring your dream builds to life.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member Card */}
              {[
                {
                  name: "Colin Vaughn",
                  role: "Founder & CEO",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format",
                  specialty: "System Architecture"
                },
                {
                  name: "Eva Marquez",
                  role: "Marketer and Customer Service",
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2687&auto=format",
                  specialty: "Hardline Watercooling"
                },
              ].map((member, idx) => (
                <div key={idx} className="bg-gaming-darker rounded-lg overflow-hidden border border-gaming-light-gray/20">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-gaming-blue font-medium">{member.role}</p>
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-300">
                      <Cpu size={14} className="text-gaming-purple" />
                      <span>Specialty: {member.specialty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gaming-purple/10"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Join the BattleforgePC Community?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Whether you're a competitive gamer, a content creator, or just getting started, 
              we have the perfect system for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-gaming-blue hover:bg-gaming-blue/80">
                <Link to="/prebuilt">Shop Pre-built PCs</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gaming-blue/50 hover:border-gaming-blue hover:bg-gaming-blue/10">
                <Link to="/customize">Build Your Own</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
