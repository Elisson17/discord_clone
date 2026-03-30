import React from "react";
import { Label as LabelUI } from "@/components/ui/label";

interface LabelProps {
  text: string;
  htmlFor?: string;
}

export default function Label({ text, htmlFor }: LabelProps) {
  return (
    <div className="flex gap-2">
      <LabelUI htmlFor={htmlFor}>{text}</LabelUI>
    </div>
  );
}
