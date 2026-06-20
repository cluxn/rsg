import { useRef, useState } from 'react';
import { Upload, Image, X } from 'lucide-react';
import { Button } from './button';
import { MediaPickerModal } from './MediaPickerModal';
import { api } from '@/lib/api';
import { type MediaItem } from './MediaCard';

interface CoverImageUploaderProps {
  value?: string;
  onUploaded: (url: string) => void;
  onRemove: () => void;
}

export function CoverImageUploader({ value, onUploaded, onRemove }: CoverImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post<{ url: string }>('/media/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(res.data.url);
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handlePickerConfirm = (selected: MediaItem[]) => {
    if (selected[0]) onUploaded(selected[0].url);
  };

  return (
    <div>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-navy/20">
          <img src={value} alt="Cover" className="w-full h-36 object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-navy/20 rounded-lg p-4 text-center bg-navy/[0.02]">
          <Image className="w-8 h-8 text-navy/30 mx-auto mb-2" />
          <p className="text-xs text-navy/50 mb-3">No cover image</p>
          <div className="flex gap-2 justify-center">
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
              <Upload className="w-3 h-3 mr-1" />
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
              Library
            </Button>
          </div>
        </div>
      )}
      {value && (
        <div className="flex gap-2 mt-2">
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
            <Upload className="w-3 h-3 mr-1" />
            {uploading ? 'Uploading…' : 'Replace'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            Library
          </Button>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={handlePickerConfirm}
      />
    </div>
  );
}
