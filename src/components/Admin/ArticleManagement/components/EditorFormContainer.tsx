
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EditorFormContainerProps {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditorFormContainer: React.FC<EditorFormContainerProps> = ({
  title,
  children,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
        </form>
      </CardContent>
    </Card>
  );
};
