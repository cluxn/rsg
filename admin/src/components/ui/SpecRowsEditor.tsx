import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

export interface SpecRow { label: string; value: string }

interface SpecRowsEditorProps {
  rows: SpecRow[];
  onChange: (rows: SpecRow[]) => void;
}

export function SpecRowsEditor({ rows, onChange }: SpecRowsEditorProps) {
  const update = (i: number, field: 'label' | 'value', val: string) => {
    const next = rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r);
    onChange(next);
  };
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));
  const addRow = () => onChange([...rows, { label: '', value: '' }]);
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...rows];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };
  const moveDown = (i: number) => {
    if (i === rows.length - 1) return;
    const next = [...rows];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {rows.length === 0 ? (
        <p className="font-body text-navy/40 text-sm py-4 text-center border border-dashed border-navy/20 rounded-lg">
          No specifications added. Click "Add Row" to start.
        </p>
      ) : (
        <div className="border border-navy/15 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-steel/5">
                <th className="text-left font-body text-navy/60 text-xs uppercase tracking-wide px-3 py-2 w-5/12">Spec Name</th>
                <th className="text-left font-body text-navy/60 text-xs uppercase tracking-wide px-3 py-2">Value</th>
                <th className="w-24 px-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {rows.map((row, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-2 py-1.5">
                    <Input
                      value={row.label}
                      onChange={e => update(i, 'label', e.target.value)}
                      placeholder="e.g. Thickness"
                      className="text-sm h-8"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <Input
                      value={row.value}
                      onChange={e => update(i, 'value', e.target.value)}
                      placeholder="e.g. 0.30mm – 0.80mm"
                      className="text-sm h-8"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveUp(i)} disabled={i === 0}>
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveDown(i)} disabled={i === rows.length - 1}>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => remove(i)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={addRow}
        className="gap-1 text-navy/60 hover:text-navy border-navy/20"
      >
        <Plus className="w-3 h-3" /> Add Row
      </Button>
    </div>
  );
}
