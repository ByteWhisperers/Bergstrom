
import React, { useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ label, value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-gray-50">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
        >
          <u>U</u>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
        >
          • Lista
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
        >
          1. Lista
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[120px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        style={{ wordBreak: 'break-word' }}
      />
    </div>
  );
};

export default RichTextEditor;
