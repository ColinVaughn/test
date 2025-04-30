
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

export function ArticleSearch() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt')
        .eq('status', 'published')
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (articleSlug: string) => {
    setOpen(false);
    navigate(`/article/${articleSlug}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search articles...</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
          <Command>
            <CommandInput
              placeholder="Search articles..."
              onValueChange={performSearch}
            />
            {loading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}
            <CommandEmpty>No articles found.</CommandEmpty>
            <CommandGroup>
              {results.map((article) => (
                <CommandItem
                  key={article.id}
                  onSelect={() => handleSelect(article.slug)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{article.title}</span>
                    {article.excerpt && (
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {article.excerpt}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
