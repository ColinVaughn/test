
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import { ArticleContent } from '@/components/Articles/ArticleContent';

interface Article {
  id: string;
  title: string;
  content: string | object;
  cover_image: string;
  created_at: string;
  meta_description?: string;
  canonical_url?: string;
  view_count?: number;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) {
          toast.error('Article not found');
          setLoading(false);
          return;
        }

        // Ensure content is properly formatted
        let processedData: Article = { ...data };
        
        // Handle content based on its type
        if (typeof data.content === 'string') {
          try {
            if (data.content.trim().startsWith('{')) {
              // Attempt to parse JSON string
              const parsedContent = JSON.parse(data.content);
              
              // Ensure the parsed content has the necessary structure
              if (parsedContent && typeof parsedContent === 'object') {
                // Make sure it has blocks array and time
                if (!parsedContent.blocks) {
                  parsedContent.blocks = [];
                }
                
                if (!parsedContent.time) {
                  parsedContent.time = Date.now();
                }
                
                processedData.content = parsedContent;
                console.log("Article content parsed as JSON object");
              } else {
                // Fallback if parsed but not valid
                processedData.content = { 
                  time: Date.now(), 
                  blocks: [
                    { 
                      type: "paragraph", 
                      data: { text: data.content } 
                    }
                  ] 
                };
              }
            } else {
              // For non-JSON string content, create a simple EditorJS structure
              processedData.content = { 
                time: Date.now(), 
                blocks: [
                  { 
                    type: "paragraph", 
                    data: { text: data.content } 
                  }
                ] 
              };
              console.log("Article content kept as string (non-JSON)");
            }
          } catch (e) {
            console.error("Failed to parse article content:", e);
            // For parsing errors, create a simple structure
            processedData.content = { 
              time: Date.now(), 
              blocks: [
                { 
                  type: "paragraph", 
                  data: { text: String(data.content) } 
                }
              ] 
            };
          }
        } else if (data.content === null || data.content === undefined) {
          // Provide empty content structure
          processedData.content = { time: Date.now(), blocks: [] };
          console.log("Empty content structure created");
        } else if (typeof data.content === 'object') {
          // Make sure the object has the required structure
          const contentObj = data.content as any;
          if (!contentObj.blocks) {
            contentObj.blocks = [];
          }
          if (!contentObj.time) {
            contentObj.time = Date.now();
          }
          processedData.content = contentObj;
        }

        console.log("Article loaded:", processedData.title, "Content type:", typeof processedData.content);
        setArticle(processedData);
      } catch (err) {
        console.error("Error fetching article:", err);
        toast.error('Error loading article');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">
          <p>Loading article...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">
          <p>Article not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <ArticleContent article={article} />
      </main>
      <Footer />
    </div>
  );
}
