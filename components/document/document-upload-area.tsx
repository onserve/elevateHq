'use client';

import { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentUploadAreaProps {
  onFilesSelected: (files: FileList) => void;
}

/**
 * DocumentUploadArea - Drag-and-drop file upload component
 *
 * Features:
 * - Drag and drop support
 * - Click to select files
 * - File type validation (PDF, PNG, JPG)
 * - Visual feedback for drag state
 *
 * API Integration point:
 * - onFilesSelected callback receives FileList
 * - Parent component handles: POST /api/documents/upload
 */
export function DocumentUploadArea({ onFilesSelected }: DocumentUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFiles = (files: FileList): boolean => {
    setError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`${file.name} has unsupported file type. Please use PDF, PNG, or JPG.`);
        return false;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} exceeds maximum size of 10MB.`);
        return false;
      }
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && validateFiles(e.dataTransfer.files)) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && validateFiles(e.target.files)) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all duration-200',
        isDragging
          ? 'border-accent/50 bg-accent/5'
          : 'border-border/50 bg-muted/20 hover:border-border/70 hover:bg-muted/40',
      )}
    >
      {/* Upload Icon */}
      <div className="p-4 bg-accent/10 rounded-full mb-4">
        <Upload className="h-8 w-8 text-accent" />
      </div>

      {/* Main Text */}
      <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
        Drop files here or click to upload
      </h3>

      {/* Subtext */}
      <p className="text-sm text-muted-foreground text-center mb-6">
        Supports PDF, PNG, and JPG files
      </p>

      {/* Choose Files Button */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="h-11 px-6 bg-foreground hover:bg-foreground/90 text-background"
      >
        <Upload className="h-4 w-4 mr-2" />
        Choose Files
      </Button>

      {/* Error Message */}
      {error && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg w-full">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
