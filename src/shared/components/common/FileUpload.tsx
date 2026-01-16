import type { DragEvent, ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

function FileUpload({ files, onFilesChange }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Validate file type
  const isValidFileType = (file: File): boolean => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    return allowedTypes.includes(file.type);
  };

  // Validate file size (5MB)
  const isValidFileSize = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
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
    const maxTotalSize = 15 * 1024 * 1024; // 15MB

    if (currentTotalSize + newTotalSize > maxTotalSize) {
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

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-[#004179] ${
          isDragging ? 'border-[#004179] bg-blue-50' : 'border-gray-200'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="1.5"
          className="mx-auto mb-3"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="mb-1 text-sm text-gray-600">
          {files.length === 0
            ? 'Prevucite datoteke ovdje ili kliknite za odabir'
            : 'Dodajte još datoteka'}
        </p>
        <p className="text-xs text-gray-400">
          Podržano: slike, PDF, dokumenti (max 5MB po fajlu, 15MB ukupno)
        </p>
        <input
          type="file"
          multiple
          className="hidden"
          id="file-input"
          onChange={handleFileSelect}
          accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf,.doc,.docx,.txt"
        />
      </div>

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Odabrane datoteke ({files.length}) - Ukupno: {getTotalSize()} / 15MB
          </p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="flex items-center gap-3">
                {/* File icon based on type */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  {file.type.startsWith('image/') ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#004179"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  ) : file.type === 'application/pdf' ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#004179"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
