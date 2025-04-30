
import React from "react";
import { TitleInput } from "./TitleInput";
import { ContentEditor } from "./ContentEditor";
import { ExcerptInput } from "./ExcerptInput";
import { CoverImageUpload } from "./CoverImageUpload";
import { EditorJSHandle } from "../EditorJS";

interface EditorFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  excerpt: string;
  setExcerpt: (excerpt: string) => void;
  coverImage: string;
  setCoverImage: (coverImage: string) => void;
  handleCoverImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  editorRef: React.RefObject<EditorJSHandle>;
  isLoading?: boolean;
}

export const EditorFormFields: React.FC<EditorFormFieldsProps> = ({
  title,
  setTitle,
  content,
  setContent,
  excerpt,
  setExcerpt,
  coverImage,
  setCoverImage,
  handleCoverImageUpload,
  isUploading,
  isSaving,
  lastSaved,
  editorRef,
  isLoading = false
}) => {
  return (
    <div className="grid gap-4">
      <TitleInput title={title} setTitle={setTitle} />

      <ContentEditor 
        useEditorJS={true}
        content={content}
        setContent={setContent}
        isSaving={isSaving}
        lastSaved={lastSaved}
        editorRef={editorRef}
        isLoading={isLoading}
      />

      <ExcerptInput excerpt={excerpt} setExcerpt={setExcerpt} />

      <CoverImageUpload
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        onFileUpload={handleCoverImageUpload}
        isUploading={isUploading}
      />
    </div>
  );
};
