import { cn } from "@/lib/utils";
import { Upload, FileText } from "lucide-react";
import { useState, useCallback } from "react";

interface UploadZoneProps {
  className?: string;
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSize?: number;
}

export const UploadZone = ({
  className,
  onFileSelect,
  accept = ".pdf,.docx",
  maxSize = 10 * 1024 * 1024, // 10MB
}: UploadZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (!file) return;

    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    if (accept && !accept.split(',').some(type => file.name.toLowerCase().endsWith(type.trim().replace('.', '')))) {
      setError("Please upload a PDF or DOCX file");
      return;
    }

    onFileSelect?.(file);
  }, [maxSize, accept, onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (!file) return;

    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    onFileSelect?.(file);
  }, [maxSize, onFileSelect]);

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        "border-2 border-dashed rounded-lg",
        "hover:border-primary/50 hover:bg-primary/5",
        isDragOver ? "border-primary bg-primary/10 shadow-glow" : "border-border",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className={cn(
          "mb-4 p-4 rounded-full transition-all duration-300",
          "bg-primary/10 group-hover:bg-primary/20",
          isDragOver && "bg-primary/20 scale-110"
        )}>
          <Upload className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop your resume here, or click to browse
        </p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Supports PDF and DOCX files (max 10MB)</span>
        </div>
        
        {error && (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
};