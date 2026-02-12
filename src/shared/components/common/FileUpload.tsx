import type { DragEvent, ChangeEvent, MouseEvent } from 'react';
import { useState, useId } from 'react';
import { Image, FileText, File } from 'lucide-react';
import {
  formatFileSize,
  VALIDATION_RULES,
  ALLOWED_FILE_TYPES,
} from '@artco-group/artco-ticketing-sync';
import { Card, Button, Icon, useToast } from '@/shared/components/ui';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  id?: string;
  variant?: 'standalone' | 'modal';
}

function FileUpload({
  files,
  onFilesChange,
  id,
  variant = 'standalone',
}: FileUploadProps) {
  const isModal = variant === 'modal';
  const toast = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;

  const isValidFileType = (file: File): boolean => {
    return ALLOWED_FILE_TYPES.ATTACHMENTS.includes(file.type);
  };

  const isValidFileSize = (file: File): boolean => {
    return file.size <= VALIDATION_RULES.FRONTEND_MAX_FILE_SIZE;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of newFiles) {
      if (!isValidFileType(file)) {
        errors.push(
          `${file.name}: Invalid file type. Only images, PDF, and documents allowed.`
        );
        continue;
      }

      if (!isValidFileSize(file)) {
        errors.push(`${file.name}: File too large. Maximum 5MB per file.`);
        continue;
      }

      validFiles.push(file);
    }

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
      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
      }

      if (validFiles.length > 0) {
        onFilesChange([...files, ...validFiles]);
      }
      return;
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const getTotalSize = (): string => {
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
    return formatFileSize(totalBytes);
  };

  return (
    <div>
      <div
        className={cn(
          'cursor-pointer text-center transition-colors',
          isModal
            ? cn('py-4', isDragging && 'bg-primary/5')
            : cn(
                'hover:border-primary rounded-lg border-2 border-dashed p-8',
                isDragging ? 'border-primary bg-primary/5' : 'border-border'
              )
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
            ? 'Drag files here or click to select'
            : 'Add more files'}
        </p>
        <p className="text-muted-xs">
          Supported: images, PDF, documents (max 5MB per file, 15MB total)
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

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-foreground-sm">
            Selected files ({files.length}) - Total: {getTotalSize()} / 15MB
          </p>
          {files.map((file, index) => (
            <Card key={index} className="flex-between p-3">
              <div className="flex-start-gap-3">
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
