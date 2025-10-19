'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Mulai menulis...',
}: RichTextEditorProps) {
  const [showImageUrl, setShowImageUrl] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Link.configure({
        openOnClick: false,
      }),
      ImageExtension,
    ],
    content: value || `<p>${placeholder}</p>`,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const addLink = () => {
    const url = prompt('Masukkan URL:');
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const addImageFromUrl = () => {
    if (imageUrl) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src: imageUrl,
          },
        })
        .run();
      setImageUrl('');
      setShowImageUrl(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-stone-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              editor.isActive('bold')
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            } disabled:opacity-50`}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              editor.isActive('italic')
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            } disabled:opacity-50`}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              editor.isActive('strike')
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            } disabled:opacity-50`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-stone-300 pr-2">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()
              }
              className={`px-2 py-1 rounded text-xs font-semibold transition ${
                editor.isActive('heading', { level })
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-100'
              }`}
              title={`Heading ${level}`}
            >
              H{level}
            </button>
          ))}
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-stone-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm transition ${
              editor.isActive('bulletList')
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
            title="Bullet List"
          >
            • List
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm transition ${
              editor.isActive('orderedList')
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
            title="Ordered List"
          >
            1. List
          </button>
        </div>

        {/* Link */}
        <div className="flex gap-1 border-r border-stone-300 pr-2">
          <button
            onClick={addLink}
            className={`px-3 py-1 rounded text-sm transition ${
              editor.isActive('link')
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
            title="Add Link"
          >
            🔗 Link
          </button>

          {editor.isActive('link') && (
            <button
              onClick={removeLink}
              className="px-3 py-1 rounded text-sm bg-red-100 text-red-700 hover:bg-red-200 transition"
              title="Remove Link"
            >
              ✕ Link
            </button>
          )}
        </div>

        {/* Image */}
        <div className="flex gap-1 border-r border-stone-300 pr-2">
          <button
            onClick={() => setShowImageUrl(!showImageUrl)}
            className="px-3 py-1 rounded text-sm bg-white text-stone-700 hover:bg-stone-100 transition"
            title="Add Image"
          >
            🖼️ Gambar
          </button>
        </div>

        {/* Clear */}
        <div className="flex gap-1">
          <button
            onClick={() => editor.chain().focus().clearContent().run()}
            className="px-3 py-1 rounded text-sm bg-white text-red-600 hover:bg-red-50 transition"
            title="Clear all"
          >
            🗑️ Hapus
          </button>
        </div>
      </div>

      {/* Image URL Input */}
      {showImageUrl && (
        <div className="flex gap-2 p-3 rounded-lg bg-stone-50 border border-stone-200">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 rounded border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') addImageFromUrl();
            }}
          />
          <button
            onClick={addImageFromUrl}
            disabled={!imageUrl}
            className="px-3 py-2 rounded text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-50"
          >
            Tambah
          </button>
          <button
            onClick={() => setShowImageUrl(false)}
            className="px-3 py-2 rounded text-sm bg-stone-300 text-white hover:bg-stone-400 transition"
          >
            Batal
          </button>
        </div>
      )}

      {/* Editor */}
      <div className="rounded-lg border border-stone-200 bg-white" suppressHydrationWarning>
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 focus:outline-none [&_.ProseMirror]:min-h-96 [&_.ProseMirror]:outline-none"
        />
      </div>

      {/* Character Count */}
      <div className="text-xs text-stone-500">
        Karakter: {editor.getText().length} · Paragraf: {editor.state.doc.childCount}
      </div>
    </div>
  );
}
