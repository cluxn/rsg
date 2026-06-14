import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { Button } from './button';
import { type MediaItem } from './MediaCard';
import { api } from '@/lib/api';

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: MediaItem[]) => void;
  alreadyLinkedIds?: number[]; // IDs already linked to this product
}

export function MediaPickerModal({ open, onClose, onConfirm, alreadyLinkedIds = [] }: MediaPickerModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: mediaItems = [] } = useQuery<MediaItem[]>({
    queryKey: ['media'],
    queryFn: () => api.get('/media').then(r => r.data),
    enabled: open,
  });

  const toggle = (id: number) => {
    if (alreadyLinkedIds.includes(id)) return; // can't re-select already linked
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = mediaItems.filter(m => selectedIds.includes(m.id));
    onConfirm(selected);
    setSelectedIds([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-navy/10">
          <h2 className="font-heading text-navy text-lg font-semibold">Select from Media Library</h2>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          {mediaItems.length === 0 ? (
            <p className="text-center text-navy/40 font-body py-12">No media uploaded yet. Upload images in the Media Library first.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {mediaItems.map(item => {
                const isLinked = alreadyLinkedIds.includes(item.id);
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    disabled={isLinked}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-steel
                      ${isLinked ? 'border-steel/40 opacity-50 cursor-not-allowed' : isSelected ? 'border-accent' : 'border-navy/10 hover:border-steel/40'}`}
                  >
                    <div className="aspect-square bg-steel/10">
                      <img
                        src={item.thumbnail_url ?? item.url}
                        alt={item.alt_text}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {(isSelected || isLinked) && (
                      <div className={`absolute top-1.5 right-1.5 rounded-full w-5 h-5 flex items-center justify-center
                        ${isLinked ? 'bg-steel' : 'bg-accent'}`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <p className="px-2 py-1.5 text-[11px] font-body text-navy/60 truncate text-left">
                      {item.original_name}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-navy/10 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
            className="bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
          >
            Add Selected ({selectedIds.length})
          </Button>
        </div>
      </div>
    </div>
  );
}
