
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { HelpCircle, Phone, Mail, MessageSquare, CheckCircle, Wrench, RefreshCcw, Box, Clock } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const SupportPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
      toast.success("Message sent successfully!", {
        description: "Our team will get back to you shortly.",
      });
    }, 1500);
  };

  const faqItems = [
    {
      question: "How long does it take to build and ship my custom PC?",
      answer: "Our standard build time is 7-10 business days. This includes component procurement, assembly, testing, and quality control. After that, shipping typically takes 2-5 business days depending on your location."
    },
    {
      question: "What warranty do your systems come with?",
      answer: "All BattleforgePC systems come with a comprehensive 1-3 year warranty covering all hardware components except for peripherals (which have a 1-year warranty). Labor and support are free for the lifetime of the system."
    },
    {
      question: "Can I upgrade my PC after purchase?",
      answer: "Absolutely! All of our systems are built with standard components that can be upgraded later. You can either purchase the parts yourself or contact us for professional upgrade services that maintain your warranty coverage."
    },
    {
      question: "Do you ship internationally?",
      answer: "No, you may use a freight forwader to ship internationally but you bare all shipping risk."
    },
    {
      question: "What if I have problems with my system?",
      answer: "Our technical support team is available 24/7 via email and during business hours via phone. We offer comprehensive troubleshooting, and if necessary, we'll provide RMA services for any defective components."
    },
    {
      question: "Can I customize beyond the options in your configurator?",
      answer: "Yes! If you have specific requirements not available in our online configurator, please contact our sales team. We can create fully custom builds with specialty components or modifications."
    },
  ];

  // Function to open Crisp chat
  const openLiveChat = () => {
    console.log("Opening Crisp chat");
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:open"]);
    } else {
      console.error("Crisp chat is not initialized");
      toast.error("Live chat is not available right now. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gaming-darker">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gaming-blue/5"></div>
            <div className="absolute h-full w-1/3 top-0 left-1/3 bg-gaming-purple/5 blur-3xl rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-gaming-blue/20 text-gaming-blue mb-4 py-1">Support</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                We've Got Your Back
              </h1>
              <p className="text-xl text-gray-300 mb-10">
                Whether you need help troubleshooting, have questions about your order, or want advice on your next upgrade, our support team is here to help.
              </p>
            </div>
          </div>
        </section>
        
        {/* Support Options */}
        <section className="py-16 bg-gaming-dark">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">How Can We Help You?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gaming-darker p-8 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center">
                <div className="bg-gaming-blue/20 p-4 rounded-full mb-6">
                  <Phone className="h-8 w-8 text-gaming-blue" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Call Us</h3>
                <p className="text-gray-300 mb-6">
                  Speak directly with our technical support team for immediate assistance.
                </p>
                <p className="text-gaming-blue font-bold">1-843-680-1187</p>
                <p className="text-gray-400 text-sm mt-1">Mon-Fri: 8am-8pm EST</p>
              </div>
              
              <div className="bg-gaming-darker p-8 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center">
                <div className="bg-gaming-purple/20 p-4 rounded-full mb-6">
                  <Mail className="h-8 w-8 text-gaming-purple" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Email Support</h3>
                <p className="text-gray-300 mb-6">
                  Send us a detailed description of your issue for a thorough response.
                </p>
                <p className="text-gaming-purple font-bold">support@battleforgepc.com</p>
                <p className="text-gray-400 text-sm mt-1">24/7 Response within 24 hours</p>
              </div>
              
              <div className="bg-gaming-darker p-8 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center">
                <div className="bg-gaming-red/20 p-4 rounded-full mb-6">
                  <MessageSquare className="h-8 w-8 text-gaming-red" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
                <p className="text-gray-300 mb-6">
                  Chat with our support team for quick answers to simple questions.
                </p>
                <Button 
                  className="bg-gaming-red hover:bg-gaming-red/80" 
                  onClick={openLiveChat}
                >
                  Start Chat
                </Button>
                <p className="text-gray-400 text-sm mt-4">Available 9am-7pm EST</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Support Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Support Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center relative">
                <div className="absolute -top-4 bg-gaming-blue w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                <div className="bg-gaming-blue/20 p-4 rounded-full mb-4 mt-4">
                  <HelpCircle className="h-6 w-6 text-gaming-blue" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Contact Us</h3>
                <p className="text-gray-300 text-sm">
                  Reach out through phone, email, or live chat with details about your issue.
                </p>
              </div>
              
              <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center relative">
                <div className="absolute -top-4 bg-gaming-purple w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                <div className="bg-gaming-purple/20 p-4 rounded-full mb-4 mt-4">
                  <Wrench className="h-6 w-6 text-gaming-purple" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Diagnostics</h3>
                <p className="text-gray-300 text-sm">
                  Our team will diagnose the issue and develop a plan to resolve it.
                </p>
              </div>
              
              <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center relative">
                <div className="absolute -top-4 bg-gaming-red w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                <div className="bg-gaming-red/20 p-4 rounded-full mb-4 mt-4">
                  <RefreshCcw className="h-6 w-6 text-gaming-red" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Resolution</h3>
                <p className="text-gray-300 text-sm">
                  We'll solve the issue through remote support or by processing an RMA if needed.
                </p>
              </div>
              
              <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center relative">
                <div className="absolute -top-4 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center font-bold">4</div>
                <div className="bg-green-500/20 p-4 rounded-full mb-4 mt-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Follow-up</h3>
                <p className="text-gray-300 text-sm">
                  We'll check back to ensure everything is working properly and you're satisfied.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* RMA Process */}
        <section className="py-16 bg-gaming-dark">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">RMA Process</h2>
            <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
              If we can't resolve your issue remotely, we'll process a Return Merchandise Authorization (RMA) to repair or replace your system or components.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gaming-darker p-6 rounded-lg border border-gaming-light-gray/20">
                <div className="bg-gaming-blue/20 p-3 rounded-full inline-block mb-4">
                  <Box className="h-5 w-5 text-gaming-blue" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Shipping</h3>
                <p className="text-gray-300 text-sm">
                  We'll provide a prepaid shipping label for warranty issues. Simply package your system or component securely and drop it off.
                </p>
              </div>
              
              <div className="bg-gaming-darker p-6 rounded-lg border border-gaming-light-gray/20">
                <div className="bg-gaming-purple/20 p-3 rounded-full inline-block mb-4">
                  <Wrench className="h-5 w-5 text-gaming-purple" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Repair</h3>
                <p className="text-gray-300 text-sm">
                  Our technicians will diagnose and repair the issue, or replace the component entirely if needed. All repairs use brand new replacement parts.
                </p>
              </div>
              
              <div className="bg-gaming-darker p-6 rounded-lg border border-gaming-light-gray/20">
                <div className="bg-gaming-red/20 p-3 rounded-full inline-block mb-4">
                  <Clock className="h-5 w-5 text-gaming-red" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Turnaround Time</h3>
                <p className="text-gray-300 text-sm">
                  Our standard RMA process takes 5-7 business days plus shipping time. We offer expedited service for critical issues.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto bg-gaming-dark rounded-xl p-6 border border-gaming-light-gray/20">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gaming-light-gray/20">
                    <AccordionTrigger className="text-white hover:text-gaming-blue">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section className="py-16 bg-gaming-dark">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center text-white">Contact Us</h2>
              <p className="text-center text-gray-300 mb-12">
                Can't find the answer you're looking for? Send us a message and we'll get back to you as soon as possible.
              </p>
              
              <div className="bg-gaming-darker rounded-xl p-8 border border-gaming-light-gray/20">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your name" 
                                className="bg-gaming-dark border-gaming-light-gray/40 text-white" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your email" 
                                className="bg-gaming-dark border-gaming-light-gray/40 text-white" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="What's this about?" 
                              className="bg-gaming-dark border-gaming-light-gray/40 text-white" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us how we can help you..." 
                              className="bg-gaming-dark border-gaming-light-gray/40 text-white h-32" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gaming-blue hover:bg-gaming-blue/80" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;
