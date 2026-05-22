'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';
import { useUploadDocument } from '@/lib/query/use-documents';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function DocumentUploadZone() {
  const { mutate: uploadDocument, isPending } = useUploadDocument();
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (!source) {
      setError("Please select a document source before uploading.");
      return;
    }
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    uploadDocument({ file, source }, {
      onSuccess: () => {
        setSource('');
      },
      onError: () => {
        setError("Upload failed. Please try again or use a supported file type.");
      }
    });
  }, [uploadDocument, source]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    noClick: true,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium leading-none">
          Document Source <span className="text-destructive">*</span>
        </label>
        <Select value={source} onValueChange={(val) => { setSource(val); setError(null); }} disabled={isPending}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a source..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MPESA">M-Pesa</SelectItem>
            <SelectItem value="BANK_STATEMENT">Bank Statement</SelectItem>
            <SelectItem value="AIRTEL">AIRTEL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${!source ? 'opacity-60 cursor-not-allowed hover:border-border' : 'cursor-pointer'}
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
      >
        <input {...getInputProps()} disabled={!source || isPending} />

        <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          {isPending ? (
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          ) : (
            <UploadCloud className="w-8 h-8 text-primary" />
          )}
        </div>

        <h3 className="text-xl font-bold mb-2">
          {isDragActive ? "Drop the file here..." : "Drop files here or click to upload"}
        </h3>
        <p className="text-muted-foreground mb-6">Supports PDF, PNG, and JPG files</p>

        <Button onClick={(e) => { e.preventDefault(); open(); }} size="lg" disabled={isPending} className="bg-foreground text-background hover:bg-foreground/90">
          <UploadCloud className="w-4 h-4 mr-2" />
          Choose Files
        </Button>

        {error && <p className="text-destructive text-sm mt-4">{error}</p>}
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-8 border border-green-100 dark:border-green-900/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <h3 className="font-bold text-lg">AI Agent Ready</h3>
        </div>
        <ul className="space-y-3">
          {[
            "Trained on financial documents",
            "Extracts dates, amounts, and vendors",
            "Categorizes transactions automatically",
            "Provides confidence scores"
          ].map((item, i) => (
            <li key={i} className="flex items-center text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 mr-3 text-emerald-500/70" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
