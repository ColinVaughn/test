
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ArticleNotification {
  articleId: string;
  title: string;
  excerpt: string;
  url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { articleId, title, excerpt, url }: ArticleNotification = await req.json();

    // Get subscribers who want article notifications
    const { data: subscribers } = await req.supabaseClient
      .from('newsletter_subscribers')
      .select('email, id')
      .eq('confirmed', true)
      .is('unsubscribed_at', null)
      .filter('notification_preferences->article_notifications', 'eq', true);

    if (!subscribers?.length) {
      return new Response(
        JSON.stringify({ message: 'No subscribers to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send emails in batches
    const batchSize = 50;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (subscriber) => {
        try {
          await resend.emails.send({
            from: 'BattleforgePC <notifications@battleforgepc.com>',
            to: [subscriber.email],
            subject: `New Article: ${title}`,
            html: `
              <h1>${title}</h1>
              <p>${excerpt}</p>
              <p><a href="${url}">Read more</a></p>
              <p>
                <small>
                  To unsubscribe from article notifications, 
                  <a href="${url}/unsubscribe?email=${encodeURIComponent(subscriber.email)}">click here</a>
                </small>
              </p>
            `,
          });

          // Record notification
          await req.supabaseClient
            .from('article_notifications')
            .insert({
              article_id: articleId,
              subscriber_id: subscriber.id
            });
        } catch (error) {
          console.error(`Failed to notify subscriber ${subscriber.email}:`, error);
        }
      }));
    }

    return new Response(
      JSON.stringify({ message: 'Notifications sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in notify-subscribers function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
