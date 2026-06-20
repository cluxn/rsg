import { useRef, useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function Btn({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button type="button" title={title} onClick={onClick}
      className={cn('px-2 py-1 rounded text-sm font-medium transition-colors select-none',
        active ? 'bg-steel text-white' : 'text-navy/70 hover:bg-navy/10 hover:text-navy')}>
      {children}
    </button>
  );
}

function Sep() { return <span className="w-px bg-navy/15 mx-1 self-stretch" />; }

export function TiptapEditor({ value, onChange, placeholder }: TiptapEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);
  const [bubblePos, setBubblePos] = useState<{ top: number; left: number } | null>(null);
  const editorWrapRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? 'Write your content here...' }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-steel underline' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full rounded-lg my-2' } }),
      Youtube.configure({ width: 640, height: 360, HTMLAttributes: { class: 'rounded-lg my-2 w-full' } }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from === to) { setBubblePos(null); return; }
      // Position bubble menu near selection
      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0) { setBubblePos(null); return; }
      const range = domSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const wrapRect = editorWrapRef.current?.getBoundingClientRect();
      if (!wrapRect || rect.width === 0) { setBubblePos(null); return; }
      setBubblePos({ top: rect.top - wrapRect.top - 44, left: rect.left - wrapRect.left + rect.width / 2 - 120 });
    },
    editorProps: {
      attributes: {
        spellcheck: 'false',
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const insertYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('YouTube video URL');
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  const insertImage = useCallback(async (file: File) => {
    if (!editor || uploadingRef.current) return;
    uploadingRef.current = true;
    try {
      const alt = window.prompt('Alt text for this image', file.name.replace(/\.[^.]+$/, '')) ?? '';
      const form = new FormData();
      form.append('file', file);
      const res = await api.post<{ url: string }>('/media/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      editor.chain().focus().setImage({ src: res.data.url, alt }).run();
    } catch {
      alert('Image upload failed. Please try again.');
    } finally {
      uploadingRef.current = false;
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [editor]);

  // Close bubble on click outside
  useEffect(() => {
    const handler = () => setBubblePos(null);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!editor) return null;

  return (
    <div ref={editorWrapRef} className="border border-navy/20 rounded-lg relative">
      {/* Sticky toolbar */}
      <div className="sticky top-16 z-20 bg-white border-b border-navy/10 px-2 py-1.5 flex flex-wrap gap-0.5 rounded-t-lg">
        {/* Text style */}
        <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></Btn>
        <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></Btn>
        <Btn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></Btn>
        <Btn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></Btn>
        <Btn title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>{'<>'}</Btn>
        <Sep />

        {/* Color + highlight pickers */}
        <label title="Text color" className="flex items-center px-1 cursor-pointer rounded hover:bg-navy/10">
          <span className="text-sm font-medium text-navy/70 mr-0.5">A</span>
          <input type="color" className="w-4 h-4 cursor-pointer border-0 p-0 opacity-0 absolute"
            onChange={e => editor.chain().focus().setColor(e.target.value).run()} />
          <span className="text-xs">🎨</span>
        </label>
        <label title="Highlight color" className="flex items-center px-1 cursor-pointer rounded hover:bg-navy/10">
          <span className="text-sm font-medium mr-0.5 bg-yellow-200 px-0.5">H</span>
          <input type="color" defaultValue="#fef08a" className="w-4 h-4 cursor-pointer border-0 p-0 opacity-0 absolute"
            onChange={e => editor.chain().focus().setHighlight({ color: e.target.value }).run()} />
          <span className="text-xs">✏️</span>
        </label>
        <Btn title="Clear formatting" onClick={() => editor.chain().focus().unsetColor().unsetHighlight().unsetAllMarks().run()}>✕A</Btn>
        <Sep />

        {/* Headings */}
        <Btn title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</Btn>
        <Btn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
        <Sep />

        {/* Lists + blocks */}
        <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Btn>
        <Btn title="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Btn>
        <Btn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo;</Btn>
        <Btn title="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{'</>'}</Btn>
        <Sep />

        {/* Alignment */}
        <Btn title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>≡L</Btn>
        <Btn title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>≡C</Btn>
        <Btn title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>≡R</Btn>
        <Btn title="Justify" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>≡J</Btn>
        <Sep />

        {/* Link, rule, image, YouTube */}
        <Btn title="Insert/edit link" active={editor.isActive('link')} onClick={setLink}>🔗</Btn>
        <Btn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</Btn>
        <Btn title="Insert image (upload)" onClick={() => fileRef.current?.click()}>🖼</Btn>
        <Btn title="Embed YouTube video" onClick={insertYoutube}>▶ YT</Btn>
      </div>

      {/* Bubble menu — appears when text is selected */}
      {bubblePos && (
        <div
          onMouseDown={e => e.stopPropagation()}
          style={{ top: bubblePos.top, left: Math.max(4, bubblePos.left) }}
          className="absolute z-30 flex items-center gap-0.5 bg-navy rounded-lg shadow-xl px-1.5 py-1 pointer-events-auto"
        >
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn('px-2 py-0.5 text-xs font-bold rounded', editor.isActive('bold') ? 'bg-white text-navy' : 'text-white hover:bg-white/20')}><b>B</b></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn('px-2 py-0.5 text-xs rounded', editor.isActive('italic') ? 'bg-white text-navy' : 'text-white hover:bg-white/20')}><i>I</i></button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn('px-2 py-0.5 text-xs rounded', editor.isActive('underline') ? 'bg-white text-navy' : 'text-white hover:bg-white/20')}><u>U</u></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
            className="px-2 py-0.5 text-xs rounded bg-yellow-400/80 text-navy hover:bg-yellow-400">HL</button>
          <button type="button" onClick={setLink}
            className={cn('px-2 py-0.5 text-xs rounded', editor.isActive('link') ? 'bg-white text-navy' : 'text-white hover:bg-white/20')}>🔗</button>
          <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().run()}
            className="px-2 py-0.5 text-xs rounded text-white/60 hover:bg-white/20">✕</button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none min-h-[320px] px-4 py-3 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[320px]"
      />

      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files?.[0] && insertImage(e.target.files[0])} />
    </div>
  );
}
