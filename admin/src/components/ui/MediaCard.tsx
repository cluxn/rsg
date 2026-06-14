import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './button';

export interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  alt_text: string;
  url: string;
  thumbnail_url?: string;
}

interface MediaCardProps {
  item: MediaItem;
  onEdit: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
}

export function MediaCard({ item, onEdit, onDelete }: MediaCardProps) {
  const thumbSrc = item.thumbnail_url ?? item.url;
  return (
    <div className="rounded-xl border border-navy/10 bg-white overflow-hidden shadow-sm flex flex-col">
      <div className="aspect-square bg-steel/10 overflow-hidden">
        <img
          src={thumbSrc}
          alt={item.alt_text}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex-1 flex flex-col gap-1">
        <p className="font-body text-navy text-xs truncate" title={item.original_name}>
          {item.original_name}
        </p>
        <p className="font-body text-navy/60 text-[11px] line-clamp-2" title={item.alt_text}>
          {item.alt_text}
        </p>
      </div>
      <div className="flex border-t border-navy/10">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 rounded-none text-navy/60 hover:text-steel text-xs gap-1"
          onClick={() => onEdit(item)}
        >
          <Pencil className="w-3 h-3" /> Edit
        </Button>
        <div className="w-px bg-navy/10" />
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 rounded-none text-navy/60 hover:text-red-500 text-xs gap-1"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="w-3 h-3" /> Delete
        </Button>
      </div>
    </div>
  );
}
