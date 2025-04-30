
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Share2, Clock, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { addDays, format, startOfDay, subDays } from 'date-fns';

interface ArticleAnalyticsProps {
  articleId: string;
}

interface DailyStats {
  date: string;
  views: number;
  unique_visitors: number;
}

export const ArticleAnalytics = ({ articleId }: ArticleAnalyticsProps) => {
  const [totalViews, setTotalViews] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [avgReadTime, setAvgReadTime] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Get article details
        const { data: article, error: articleError } = await supabase
          .from('articles')
          .select('view_count, share_count, total_reading_time')
          .eq('id', articleId)
          .single();
          
        if (articleError) {
          console.error("Error fetching article analytics:", articleError);
          return;
        }

        if (article) {
          setTotalViews(article.view_count || 0);
          setTotalShares(article.share_count || 0);
          // Add calculation for average reading time if needed
        }

        // Get daily analytics for the last 7 days
        const endDate = startOfDay(new Date());
        const startDate = subDays(endDate, 7);
        
        const { data: analytics, error: analyticsError } = await supabase
          .from('article_analytics')
          .select('view_date, views, unique_visitors')
          .eq('article_id', articleId)
          .gte('view_date', startDate.toISOString())
          .lte('view_date', endDate.toISOString())
          .order('view_date', { ascending: true });
          
        if (analyticsError) {
          console.error("Error fetching daily analytics:", analyticsError);
          return;
        }

        // Fill in missing dates with 0 values
        const filledData: DailyStats[] = [];
        let currentDate = startDate;
        
        while (currentDate <= endDate) {
          const formattedDate = format(currentDate, 'yyyy-MM-dd');
          const existingData = analytics?.find(item => 
            format(new Date(item.view_date), 'yyyy-MM-dd') === formattedDate
          );
          
          filledData.push({
            date: format(currentDate, 'MMM dd'),
            views: existingData?.views || 0,
            unique_visitors: existingData?.unique_visitors || 0
          });
          
          currentDate = addDays(currentDate, 1);
        }
        
        setDailyStats(filledData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      fetchAnalytics();
    }
  }, [articleId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Article Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/40 p-4 rounded-lg flex flex-col items-center">
            <div className="text-muted-foreground mb-2 flex items-center">
              <Eye className="h-4 w-4 mr-1" /> Total Views
            </div>
            <div className="text-2xl font-bold">{totalViews}</div>
          </div>
          
          <div className="bg-muted/40 p-4 rounded-lg flex flex-col items-center">
            <div className="text-muted-foreground mb-2 flex items-center">
              <Share2 className="h-4 w-4 mr-1" /> Total Shares
            </div>
            <div className="text-2xl font-bold">{totalShares}</div>
          </div>
          
          <div className="bg-muted/40 p-4 rounded-lg flex flex-col items-center">
            <div className="text-muted-foreground mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Avg. Reading Time
            </div>
            <div className="text-2xl font-bold">{avgReadTime || '--'} min</div>
          </div>
          
          <div className="bg-muted/40 p-4 rounded-lg flex flex-col items-center">
            <div className="text-muted-foreground mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> Last 7 Days
            </div>
            <div className="text-2xl font-bold">
              {dailyStats.reduce((sum, day) => sum + day.views, 0)} views
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyStats}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" name="Views" fill="#3b82f6" />
              <Bar dataKey="unique_visitors" name="Unique Visitors" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
