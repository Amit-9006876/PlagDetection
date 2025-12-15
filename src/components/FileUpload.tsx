import { useCallback } from 'react';
import { Upload, FileText, X, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isValidFileType, getSupportedExtensions } from '@/utils/fileParser';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  label: string;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return '📄';
  if (ext === 'docx') return '📝';
  return '📃';
};

export function FileUpload({ file, onFileSelect, label }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && isValidFileType(droppedFile)) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile && isValidFileType(selectedFile)) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  const handleRemove = useCallback(() => {
    onFileSelect(null);
  }, [onFileSelect]);

  const acceptTypes = getSupportedExtensions().join(',');

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300",
          file 
            ? "border-accent bg-accent/5" 
            : "border-border bg-card hover:border-accent/50 hover:bg-accent/5",
          "cursor-pointer group"
        )}
      >
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg text-2xl">
                {getFileIcon(file.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center cursor-pointer">
            <div className="p-4 bg-primary/5 rounded-full mb-4 group-hover:bg-accent/10 transition-colors">
              <Upload className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Drop your file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, Word (.docx), and Text files
            </p>
            <div className="flex gap-2 mt-3">
              <span className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground">.pdf</span>
              <span className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground">.docx</span>
              <span className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground">.txt</span>
            </div>
            <input
              type="file"
              accept={acceptTypes}
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
