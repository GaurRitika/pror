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
        "relative group cursor-pointer transition-all duration-500 transform",
        "border-2 border-dashed rounded-xl overflow-hidden",
        "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm",
        "hover:border-primary/60 hover:bg-primary/5 hover:scale-[1.02] hover:shadow-glow",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        isDragOver ? "border-primary bg-primary/10 shadow-glow scale-[1.02] animate-pulse" : "border-border/50",
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
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-8 h-8 border border-primary/20 rounded transform rotate-45"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border border-secondary/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary/10 rounded transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      
      <div className="relative z-5 flex flex-col items-center justify-center p-12 text-center">
        <div className={cn(
          "mb-6 p-6 rounded-full transition-all duration-500 transform",
          "bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30",
          "border border-primary/20 shadow-lg group-hover:shadow-glow",
          isDragOver && "scale-110 rotate-12 shadow-glow animate-bounce"
        )}>
          <Upload className={cn(
            "h-10 w-10 transition-all duration-300",
            "text-primary group-hover:text-primary/80",
            isDragOver && "animate-pulse"
          )} />
        </div>
        
        <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
          📄 Upload Your Resume
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
          Drag and drop your resume here, or{" "}
          <span className="text-primary font-medium underline decoration-primary/30 underline-offset-2">
            click to browse
          </span>
        </p>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/30">
          <FileText className="h-4 w-4 text-primary" />
          <span>PDF & DOCX • Max 10MB</span>
        </div>
        
        {error && (
          <div className="mt-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">⚠️ {error}</p>
          </div>
        )}
      </div>
      
      {/* Animated border effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl transition-opacity duration-300",
        "bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0",
        "group-hover:opacity-100",
        isDragOver && "opacity-100 animate-pulse"
      )} style={{
        background: isDragOver 
          ? "linear-gradient(45deg, hsl(var(--primary) / 0.2), hsl(var(--secondary) / 0.2), hsl(var(--primary) / 0.2))"
          : undefined,
        backgroundSize: "200% 200%",
        animation: isDragOver ? "gradient 2s ease infinite" : undefined
      }} />
    </div>
  );
};