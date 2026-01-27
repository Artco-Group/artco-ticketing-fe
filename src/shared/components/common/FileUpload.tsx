import type { DragEvent, ChangeEvent, MouseEvent } from 'react';
import { useState, useId } from 'react';
import { toast } from 'sonner';
import { Image, FileText, File } from 'lucide-react';
import {
  formatFileSize,
  VALIDATION_RULES,
  ALLOWED_FILE_TYPES,
} from '@artco-group/artco-ticketing-sync';
import { Card, Button, Icon } from '@/shared/components/ui';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  id?: string;
}

function FileUpload({ files, onFilesChange, id }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;

  // Validate file type
  const isValidFileType = (file: File): boolean => {
    return ALLOWED_FILE_TYPES.ATTACHMENTS.includes(file.type);
  };

  // Validate file size
  const isValidFileSize = (file: File): boolean => {
    return file.size <= VALIDATION_RULES.FRONTEND_MAX_FILE_SIZE;
  };

  // Handle file drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  // Handle drag over
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    addFiles(selectedFiles);
  };

  // Add files with validation
  const addFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of newFiles) {
      // Validate file type
      if (!isValidFileType(file)) {
        errors.push(
          `${file.name}: Invalid file type. Only images, PDF, and documents allowed.`
        );
        continue;
      }

      // Validate file size
      if (!isValidFileSize(file)) {
        errors.push(`${file.name}: File too large. Maximum 5MB per file.`);
        continue;
      }

      validFiles.push(file);
    }

    // Calculate total size of existing + new files
    const currentTotalSize = files.reduce((sum, f) => sum + f.size, 0);
    const newTotalSize = validFiles.reduce((sum, f) => sum + f.size, 0);

    if (
      currentTotalSize + newTotalSize >
      VALIDATION_RULES.FRONTEND_MAX_TOTAL_SIZE
    ) {
      const currentMB = (currentTotalSize / (1024 * 1024)).toFixed(2);
      const newMB = (newTotalSize / (1024 * 1024)).toFixed(2);
      errors.push(
        `Total file size would exceed 15MB limit. Current: ${currentMB}MB, Adding: ${newMB}MB`
      );
    } else {
      // Show errors if any
      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
      }

      // Update files if valid
      if (validFiles.length > 0) {
        onFilesChange([...files, ...validFiles]);
      }
      return;
    }

    // Show errors
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }
  };

  // Remove file
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  // Get total file size
  const getTotalSize = (): string => {
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
    return formatFileSize(totalBytes);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        className={cn(
          'hover:border-primary cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <Icon
          name="upload"
          size="xl"
          className="text-muted-foreground mx-auto mb-3"
        />
        <p className="text-muted-sm mb-1">
          {files.length === 0
            ? 'Prevucite datoteke ovdje ili kliknite za odabir'
            : 'Dodajte još datoteka'}
        </p>
        <p className="text-muted-xs">
          Podržano: slike, PDF, dokumenti (max 5MB po fajlu, 15MB ukupno)
        </p>
        <input
          type="file"
          multiple
          className="hidden"
          id={inputId}
          onChange={handleFileSelect}
          accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf,.doc,.docx,.txt"
        />
      </div>

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-foreground-sm">
            Odabrane datoteke ({files.length}) - Ukupno: {getTotalSize()} / 15MB
          </p>
          {files.map((file, index) => (
            <Card key={index} className="flex-between p-3">
              <div className="flex-start-gap-3">
                {/* File icon based on type */}
                <div className="bg-primary/10 icon-container-sm">
                  {file.type.startsWith('image/') ? (
                    <Image className="text-primary h-5 w-5" />
                  ) : file.type === 'application/pdf' ? (
                    <FileText className="text-destructive h-5 w-5" />
                  ) : (
                    <File className="text-primary h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-foreground-sm">{file.name}</p>
                  <p className="text-muted-xs">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="hover-destructive"
              >
                <Icon name="close" size="lg" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
