import { useState, useRef, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from './button';
import { api } from '@/lib/api';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export function UploadModal({ open, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [altError, setAltError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('file', file!);
      formData.append('alt_text', altText.trim());
      const res = await api.post('/media/upload', formData);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
      handleClose();
    },
  });

  const handleClose = () => {
    setFile(null);
    setAltText('');
    setAltError('');
    if (fileRef.current) fileRef.current.value = '';
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!altText.trim()) { setAltError('Alt text is required'); return; }
    setAltError('');
    uploadMutation.mutate();
  };

  if (!open) return null;

  const canSubmit = !!file && altText.trim().length > 0 && !uploadMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-heading text-navy text-lg font-semibold">Upload Media</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-navy/70 text-sm block mb-1">Image File</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-navy/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-steel/10 file:text-navy file:font-body cursor-pointer"
            />
          </div>
          <div>
            <label className="font-body text-navy/70 text-sm block mb-1">
              Alt Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={altText}
              onChange={e => { setAltText(e.target.value); if (e.target.value.trim()) setAltError(''); }}
              placeholder="Describe the image for accessibility (required)"
              rows={3}
              className="w-full rounded-lg border border-navy/20 p-3 font-body text-sm text-navy resize-none focus:outline-none focus:ring-2 focus:ring-steel/40"
            />
            {altError && <p className="text-red-500 text-xs mt-1">{altError}</p>}
          </div>
          {uploadMutation.isError && (
            <p className="text-red-500 text-sm">Upload failed. Please try again.</p>
          )}
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {uploadMutation.isPending ? 'Uploading…' : 'Upload Image'}
          </Button>
        </form>
      </div>
    </div>
  );
}
