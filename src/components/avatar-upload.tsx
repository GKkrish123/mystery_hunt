"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toBase64 } from "@/lib/utils";
import { PencilIcon, User2Icon } from "lucide-react";
import React from "react";

type AvatarUploadProps = {
  value?: string;
  onChange?: (value?: string) => void;
};

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]!;
      const base64 = await toBase64(file);
      onChange?.(base64);
    }
  };

  return (
    <div className="relative h-40 w-40">
      <Avatar className="h-full w-full">
        <AvatarImage src={value} className="object-cover" />
        <AvatarFallback className="bg-secondary">
          <User2Icon className="h-16 w-16" />
        </AvatarFallback>
      </Avatar>
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-0 right-0 rounded-full bg-secondary-foreground/90 p-1 hover:bg-secondary-foreground"
        onClick={(e) => {
          e.preventDefault();
          inputRef.current?.click();
        }}
      >
        <PencilIcon className="h-4 w-4 text-white dark:text-black" />
      </Button>
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept="image/*"
      />
    </div>
  );
}
