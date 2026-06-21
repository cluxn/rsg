import { useRef, useCallback, useState } from 'react';
import { Image } from '@tiptap/extension-image';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';

type Align = 'left' | 'center' | 'right' | 'full';

const PRESET_SIZES = [
  { label: 'Thumbnail  (160px)',  width: 160 },
  { label: 'Small       (320px)',  width: 320 },
  { label: 'Medium      (480px)',  width: 480 },
  { label: 'Large       (640px)',  width: 640 },
  { label: 'XL          (800px)',  width: 800 },
  { label: 'Banner     (1024px)', width: 1024 },
  { label: 'Full Width  (100%)',   width: null },
];

const ALIGN_STYLES: Record<Align, React.CSSProperties> = {
  left:   { display: 'block', marginRight: 'auto', marginLeft: '0' },
  center: { display: 'block', margin: '0 auto' },
  right:  { display: 'block', marginLeft: 'auto', marginRight: '0' },
  full:   { display: 'block', width: '100%' },
};

function ResizableImageView({ node, updateAttributes, selected, editor }: NodeViewProps) {
  const { src, alt, title, width, align } = node.attrs as {
    src: string; alt?: string; title?: string; width?: number; align?: Align;
  };

  const imgRef = useRef<HTMLImageElement>(null);
  const altInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [editingAlt, setEditingAlt] = useState(false);
  const [altValue, setAltValue] = useState(alt ?? '');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title ?? '');

  const startResize = useCallback((e: React.MouseEvent, fromRight: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imgRef.current) return;

    const startX = e.clientX;
    const startW = imgRef.current.offsetWidth;
    setDragging(true);

    const onMove = (mv: MouseEvent) => {
      const delta = mv.clientX - startX;
      const newW = Math.max(80, startW + (fromRight ? delta : -delta));
      updateAttributes({ width: Math.round(newW) });
    };
    const onUp = () => {
      setDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [updateAttributes]);

  const deleteImage = useCallback(() => {
    const { from } = editor.view.state.selection;
    editor.chain().focus().deleteRange({ from, to: from + node.nodeSize }).run();
  }, [editor, node.nodeSize]);

  const commitAlt = () => {
    updateAttributes({ alt: altValue });
    setEditingAlt(false);
  };

  const commitTitle = () => {
    updateAttributes({ title: titleValue });
    setEditingTitle(false);
  };

  const currentAlign: Align = (align as Align) || 'center';

  const imgStyle: React.CSSProperties = {
    ...ALIGN_STYLES[currentAlign],
    width: width ? `${width}px` : currentAlign === 'full' ? '100%' : undefined,
    maxWidth: '100%',
    userSelect: 'none',
    cursor: dragging ? 'ew-resize' : 'default',
    outline: selected ? '2.5px solid #0E4FA8' : 'none',
    outlineOffset: 2,
    borderRadius: 6,
  };

  const handleStyle = (pos: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => ({
    position: 'absolute',
    width: 12,
    height: 12,
    background: '#0E4FA8',
    border: '2px solid white',
    borderRadius: 3,
    cursor: 'ew-resize',
    zIndex: 10,
    pointerEvents: 'all',
    ...(pos === 'tl' ? { top: -6, left: -6 } : {}),
    ...(pos === 'tr' ? { top: -6, right: -6 } : {}),
    ...(pos === 'bl' ? { bottom: -6, left: -6 } : {}),
    ...(pos === 'br' ? { bottom: -6, right: -6 } : {}),
  });

  const btnBase: React.CSSProperties = {
    padding: '4px 10px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'inherit',
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    lineHeight: '1.4',
    transition: 'background 0.1s',
  };
  const btnActive: React.CSSProperties = { background: '#0E4FA8', color: 'white' };
  const btnIdle: React.CSSProperties = { background: 'transparent', color: '#07152B' };
  const sepStyle: React.CSSProperties = { width: 1, alignSelf: 'stretch', background: 'rgba(7,21,43,0.12)', margin: '0 4px' };

  return (
    <NodeViewWrapper style={{ display: 'block', position: 'relative', lineHeight: 0 }}>

      {/* Floating toolbar — shown when node is selected */}
      {selected && (
        <div
          contentEditable={false}
          style={{
            position: 'absolute',
            top: -52,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: 'white',
            border: '1px solid rgba(7,21,43,0.15)',
            borderRadius: 10,
            boxShadow: '0 6px 24px rgba(7,21,43,0.14)',
            padding: '5px 8px',
            whiteSpace: 'nowrap',
            minWidth: 'max-content',
          }}
        >
          {/* Alignment */}
          {(['left', 'center', 'right', 'full'] as Align[]).map(a => (
            <button
              key={a}
              type="button"
              onMouseDown={e => { e.preventDefault(); updateAttributes({ align: a }); }}
              style={{ ...btnBase, ...(currentAlign === a ? btnActive : btnIdle) }}
              title={`Align ${a}`}
            >
              {a === 'left' ? '⇤ Left' : a === 'center' ? '≡ Center' : a === 'right' ? 'Right ⇥' : '↔ Full'}
            </button>
          ))}

          <span style={sepStyle} />

          {/* Preset size dropdown */}
          <select
            value={width ?? ''}
            onChange={e => {
              const val = e.target.value;
              updateAttributes({ width: val === '' ? null : Number(val), align: val === '' ? 'full' : (align || 'center') });
            }}
            style={{
              fontSize: 12,
              padding: '3px 6px',
              border: '1px solid rgba(7,21,43,0.2)',
              borderRadius: 5,
              color: '#07152B',
              background: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
              outline: 'none',
            }}
            title="Preset size"
          >
            <option value="" disabled>Size preset</option>
            {PRESET_SIZES.map(p => (
              <option key={p.label} value={p.width ?? ''}>{p.label}</option>
            ))}
          </select>

          <span style={sepStyle} />

          {/* Alt text — inline edit */}
          {editingAlt ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                ref={altInputRef}
                autoFocus
                value={altValue}
                onChange={e => setAltValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commitAlt(); if (e.key === 'Escape') setEditingAlt(false); }}
                placeholder="Alt text…"
                style={{
                  fontSize: 13,
                  padding: '3px 8px',
                  border: '1px solid #0E4FA8',
                  borderRadius: 5,
                  outline: 'none',
                  width: 160,
                  color: '#07152B',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); commitAlt(); }}
                style={{ ...btnBase, ...btnActive, padding: '4px 8px' }}
              >
                ✓
              </button>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); setEditingAlt(false); }}
                style={{ ...btnBase, ...btnIdle, padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); setAltValue(alt ?? ''); setEditingAlt(true); }}
              style={{ ...btnBase, ...btnIdle }}
              title="Edit alt text"
            >
              Alt{alt ? `: "${alt.slice(0, 20)}${alt.length > 20 ? '…' : ''}"` : ''}
            </button>
          )}

          <span style={sepStyle} />

          {/* Title / Rename — inline edit */}
          {editingTitle ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                autoFocus
                value={titleValue}
                onChange={e => setTitleValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commitTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
                placeholder="Image name…"
                style={{
                  fontSize: 13,
                  padding: '3px 8px',
                  border: '1px solid #0E4FA8',
                  borderRadius: 5,
                  outline: 'none',
                  width: 160,
                  color: '#07152B',
                  fontFamily: 'inherit',
                }}
              />
              <button type="button" onMouseDown={e => { e.preventDefault(); commitTitle(); }}
                style={{ ...btnBase, ...btnActive, padding: '4px 8px' }}>✓</button>
              <button type="button" onMouseDown={e => { e.preventDefault(); setEditingTitle(false); }}
                style={{ ...btnBase, ...btnIdle, padding: '4px 8px' }}>✕</button>
            </div>
          ) : (
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); setTitleValue(title ?? ''); setEditingTitle(true); }}
              style={{ ...btnBase, ...btnIdle }}
              title="Rename image (sets title/tooltip)"
            >
              Rename{title ? `: "${title.slice(0, 18)}${title.length > 18 ? '…' : ''}"` : ''}
            </button>
          )}

          <span style={sepStyle} />

          {/* Delete */}
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); deleteImage(); }}
            style={{ ...btnBase, background: 'transparent', color: '#ef4444', padding: '4px 10px' }}
            title="Delete image"
          >
            Delete
          </button>
        </div>
      )}

      {/* Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        title={title}
        draggable={false}
        style={imgStyle}
      />

      {/* Resize handles */}
      {selected && (
        <div
          contentEditable={false}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}
        >
          <div style={handleStyle('tl')} onMouseDown={e => startResize(e, false)} />
          <div style={handleStyle('tr')} onMouseDown={e => startResize(e, true)} />
          <div style={handleStyle('bl')} onMouseDown={e => startResize(e, false)} />
          <div style={handleStyle('br')} onMouseDown={e => startResize(e, true)} />
        </div>
      )}
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: el => el.getAttribute('width') ? Number(el.getAttribute('width')) : null,
        renderHTML: attrs => attrs.width ? { width: attrs.width } : {},
      },
      title: {
        default: null,
        parseHTML: el => el.getAttribute('title') ?? null,
        renderHTML: attrs => attrs.title ? { title: attrs.title } : {},
      },
      align: {
        default: 'center',
        parseHTML: el => el.getAttribute('data-align') ?? 'center',
        renderHTML: attrs => ({ 'data-align': attrs.align ?? 'center' }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
