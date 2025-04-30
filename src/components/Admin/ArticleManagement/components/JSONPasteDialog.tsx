
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { validateEditorJSFormat } from '../utils/editorJSValidation';

interface JSONPasteDialogProps {
  onJsonPaste: (jsonData: object) => void;
}

export const JSONPasteDialog: React.FC<JSONPasteDialogProps> = ({ onJsonPaste }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleJSONPaste = () => {
    if (!jsonInput.trim()) {
      return;
    }
    
    // Validate the JSON input
    const validation = validateEditorJSFormat(jsonInput);
    
    if (!validation.isValid) {
      toast.error(`Invalid EditorJS format: ${validation.error}`);
      return;
    }
    
    try {
      // JSON is valid, parse it
      const jsonData = JSON.parse(jsonInput);
      
      // Ensure time property exists
      if (!jsonData.time) {
        jsonData.time = Date.now();
      }
      
      // Pass the validated data to parent component
      onJsonPaste(jsonData);
      setDialogOpen(false);
      toast.success('Content loaded successfully');
    } catch (error) {
      console.error('JSON parsing error:', error);
      toast.error('Failed to load content');
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Paste JSON
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paste EditorJS JSON</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea 
            placeholder="Paste your EditorJS JSON content here..."
            rows={10}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="font-mono text-sm"
          />
          <div className="flex justify-end">
            <Button onClick={handleJSONPaste}>
              Load Content
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
