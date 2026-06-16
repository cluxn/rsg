import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ value, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? 'Write your content here...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="border border-input rounded-md min-h-[200px] px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-ring">
      {editor && (
        <div className="flex gap-1 mb-2 border-b pb-2">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'font-bold text-primary' : ''}>B</button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
