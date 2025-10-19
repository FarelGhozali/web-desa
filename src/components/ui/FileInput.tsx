'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Button from './Button';

interface FileInputProps {
  value: string[];
  onChange: (files: string[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  label?: string;
  hint?: string;
  error?: string;
}

/**
 * FileInput component with drag-and-drop support and preview gallery
 * Note: In a real app, you'd upload to a storage service (e.g., S3, Cloudinary)
 * For now, this accepts URLs and displays previews
 */
export default function FileInput({
  value,
  onChange,
  accept = 'image/*',
  multiple = true,
  maxFiles = 10,
  label = 'Upload Foto',
  hint = 'Drag and drop atau klik untuk memilih file',
  error,
}: FileInputProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    // In a real app, you would upload these files to a storage service
    // For now, we'll create object URLs for preview
    const newUrls: string[] = [];

    Array.from(files).forEach((file) => {
      if (value.length + newUrls.length < maxFiles) {
        const url = URL.createObjectURL(file);
        newUrls.push(url);
      }
    });

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
    }
  };

  const handleAddUrl = () => {
    if (!newPhotoUrl.trim()) {
      setUrlError('Masukkan URL foto');
      return;
    }

    // Basic URL validation
    try {
      new URL(newPhotoUrl);
    } catch {
      setUrlError('URL tidak valid');
      return;
    }

    if (value.length >= maxFiles) {
      setUrlError(`Maksimal ${maxFiles} foto`);
      return;
    }

    onChange([...value, newPhotoUrl]);
    setNewPhotoUrl('');
    setUrlError('');
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = value.filter((_, i) => i !== index);
    onChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-medium text-stone-900">{label}</label>}

      {/* Photo Gallery Preview */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {value.map((photo, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-lg bg-stone-100">
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <span className="text-sm font-medium text-white">Hapus</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Section */}
      <div className="space-y-3">
        {/* Drag and Drop Area */}
        {value.length < maxFiles && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition ${
              isDragActive
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-stone-300 bg-stone-50 hover:border-emerald-400'
            } ${error ? 'border-rose-500 bg-rose-50' : ''}`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple={multiple}
              accept={accept}
              onChange={handleChange}
              className="hidden"
            />
            <div className="space-y-2">
              <div className="text-2xl">📷</div>
              <p className="text-sm font-medium text-stone-900">{hint}</p>
              <p className="text-xs text-stone-600">
                {value.length}/{maxFiles} foto
              </p>
            </div>
          </div>
        )}

        {/* URL Input Alternative */}
        {value.length < maxFiles && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-stone-600">Atau masukkan URL foto</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => {
                  setNewPhotoUrl(e.target.value);
                  setUrlError('');
                }}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              />
              <Button
                type="button"
                onClick={handleAddUrl}
                variant="outline"
                size="sm"
              >
                Tambah
              </Button>
            </div>
            {urlError && <p className="text-xs text-rose-600">{urlError}</p>}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
