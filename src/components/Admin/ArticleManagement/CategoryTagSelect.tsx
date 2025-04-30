
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface CategoryTagSelectProps {
  articleId?: string;
  onCategoriesChange?: (categoryIds: string[]) => void;
  onTagsChange?: (tagIds: string[]) => void;
}

export const CategoryTagSelect: React.FC<CategoryTagSelectProps> = ({ 
  articleId,
  onCategoriesChange,
  onTagsChange
}) => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('article_categories')
      .select('id, name')
      .order('name');
    
    if (error) {
      toast.error('Failed to load categories');
      return;
    }
    setCategories(data);
  };

  const loadTags = async () => {
    const { data, error } = await supabase
      .from('article_tags')
      .select('id, name')
      .order('name');
    
    if (error) {
      toast.error('Failed to load tags');
      return;
    }
    setTags(data);
  };

  const loadArticleCategories = async () => {
    if (!articleId) return;
    const { data, error } = await supabase
      .from('article_category_relations')
      .select('category_id')
      .eq('article_id', articleId);
    
    if (error) {
      toast.error('Failed to load article categories');
      return;
    }
    const categoryIds = data.map(relation => relation.category_id);
    setSelectedCategories(categoryIds);
    onCategoriesChange?.(categoryIds);
  };

  const loadArticleTags = async () => {
    if (!articleId) return;
    const { data, error } = await supabase
      .from('article_tag_relations')
      .select('tag_id')
      .eq('article_id', articleId);
    
    if (error) {
      toast.error('Failed to load article tags');
      return;
    }
    const tagIds = data.map(relation => relation.tag_id);
    setSelectedTags(tagIds);
    onTagsChange?.(tagIds);
  };

  React.useEffect(() => {
    loadCategories();
    loadTags();
    if (articleId) {
      loadArticleCategories();
      loadArticleTags();
    }
  }, [articleId]);

  const handleCategoryChange = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelection);
    onCategoriesChange?.(newSelection);
  };

  const handleTagChange = (tagId: string) => {
    const newSelection = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelection);
    onTagsChange?.(newSelection);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Categories</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategories.includes(category.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagChange(tag.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
