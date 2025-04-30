
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export const CategoryTagManager = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [newTagName, setNewTagName] = React.useState("");

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('article_categories')
      .select('*')
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
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Failed to load tags');
      return;
    }
    setTags(data);
  };

  React.useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  const createCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { error } = await supabase
      .from('article_categories')
      .insert([{ name: newCategoryName, slug }]);

    if (error) {
      toast.error('Failed to create category');
      return;
    }

    toast.success('Category created');
    setNewCategoryName("");
    loadCategories();
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;
    
    const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { error } = await supabase
      .from('article_tags')
      .insert([{ name: newTagName, slug }]);

    if (error) {
      toast.error('Failed to create tag');
      return;
    }

    toast.success('Tag created');
    setNewTagName("");
    loadTags();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('article_categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete category');
      return;
    }

    toast.success('Category deleted');
    loadCategories();
  };

  const deleteTag = async (id: string) => {
    const { error } = await supabase
      .from('article_tags')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete tag');
      return;
    }

    toast.success('Tag deleted');
    loadTags();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={createCategory}>Add Category</Button>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span>{category.name}</span>
                <Button variant="destructive" size="sm" onClick={() => deleteCategory(category.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
            <Button onClick={createTag}>Add Tag</Button>
          </div>
          <div className="space-y-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span>{tag.name}</span>
                <Button variant="destructive" size="sm" onClick={() => deleteTag(tag.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
