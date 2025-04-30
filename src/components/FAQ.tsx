
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

const FAQ = () => {
  const faqs = [
    {
      question: "How long does it take to build and ship a custom PC?",
      answer: "Our custom PCs typically take 7-10 business days to build, test, and ship. During peak seasons, this may extend to 12-15 days. All systems undergo extensive stress testing to ensure stability and performance before shipping."
    },
    {
      question: "What warranty do you offer on your custom PCs?",
      answer: "All BattleforgePC systems come with a comprehensive 3-year warranty covering parts and labor. This includes lifetime technical support from our expert team to ensure your system runs optimally for years to come."
    },
    {
      question: "Can I upgrade my PC later on?",
      answer: "Absolutely! All our systems are built using standard components that make future upgrades easy. Our modular approach ensures you can swap out components like GPUs, RAM, or storage as your needs evolve or as technology advances."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most international locations. International orders may require additional processing time and shipping costs vary by destination. Contact our support team for specific information about shipping to your location."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, bank transfers, and cryptocurrency payments. For large orders, we also offer financing options through affirm with competitive interest rates and flexible payment terms."
    }
  ];

  return (
    <section className="py-16 bg-gaming-dark">
      <Helmet>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              ${faqs.map(faq => `{
                "@type": "Question",
                "name": "${faq.question}",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "${faq.answer}"
                }
              }`).join(',')}
            ]
          }
        `}</script>
      </Helmet>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-white">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gaming-darker border border-gaming-light-gray/20 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 text-white hover:text-gaming-blue text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
