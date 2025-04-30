
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const NewsletterManager: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const handleSendNewsletter = async () => {
    if (!subject || !body) {
      toast.error('Please enter both subject and body');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { subject, body }
      });

      if (error) throw error;

      toast.success('Newsletter sent successfully!');
      // Reset form
      setSubject('');
      setBody('');
    } catch (error: any) {
      console.error('Newsletter send error:', error);
      toast.error('Failed to send newsletter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { email: testEmail }
      });

      if (error) throw error;

      toast.success('Test email sent successfully!');
    } catch (error: any) {
      console.error('Test email send error:', error);
      toast.error('Failed to send test email. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Send Newsletter</h2>
      <div className="space-y-2">
        <Input 
          placeholder="Newsletter Subject" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isLoading}
        />
        <Textarea 
          placeholder="Newsletter Body" 
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={isLoading}
          className="min-h-[200px]"
        />
        <Button 
          onClick={handleSendNewsletter}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Newsletter'}
        </Button>
      </div>
      
      <div className="space-y-2 mt-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Send Test Email</h3>
        <div className="flex space-x-2">
          <Input 
            placeholder="Enter test email address" 
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            type="email"
          />
          <Button onClick={handleTestEmail}>
            Send Test Email
          </Button>
        </div>
      </div>
    </div>
  );
};
