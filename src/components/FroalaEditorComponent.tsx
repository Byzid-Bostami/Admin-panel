'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import 'froala-editor/js/plugins.pkgd.min.js'; 
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

const FroalaEditor = dynamic(() => import('react-froala-wysiwyg'), { ssr: false });

interface FroalaEditorProps {
  onChange?: (content: string) => void;
  initialValue?: string;
}

export default function FroalaEditorComponent({ onChange, initialValue = '' }: FroalaEditorProps) {
  const [content, setContent] = useState<string>(initialValue);

  const handleModelChange = useCallback((newContent: string) => {
    const updatedContent = newContent
      .replace(/<h1>/g, '<h1 style="font-size: 2rem; font-weight: bold; color: #111;">')
      .replace(/<h2>/g, '<h2 style="font-size: 1.75rem; font-weight: bold; color: #222;">')
      .replace(/<h3>/g, '<h3 style="font-size: 1.5rem; font-weight: bold; color: #333;">')
      .replace(/<h4>/g, '<h4 style="font-size: 1.25rem; font-weight: bold; color: #444;">')
      .replace(/<h5>/g, '<h5 style="font-size: 1rem; font-weight: bold; color: #555;">')
      .replace(/<h6>/g, '<h6 style="font-size: 0.875rem; font-weight: bold; color: #666;">');

    setContent(updatedContent);
    if (onChange) {
      onChange(updatedContent);
    }
  }, [onChange]);

  const config = {
    placeholderText: 'Write post...',
    heightMin: 250,
    toolbarButtons: [
      'bold', 'italic', 'underline', 'strikeThrough',
      'paragraphFormat',
      'align', 'formatOL', 'formatUL', 'indent', 'outdent',
      'insertLink',
      'undo', 'redo', 'html'
    ],
    paragraphFormat: {
      N: 'Normal',
      H1: 'Heading 1',
      H2: 'Heading 2',
      H3: 'Heading 3',
      H4: 'Heading 4',
      H5: 'Heading 5',
      H6: 'Heading 6'
    },
    quickInsertEnabled: false,
    branding: false,
  };

  return (
    <div className="froala-container">
      <FroalaEditor
        tag="textarea"
        model={content}
        onModelChange={handleModelChange}
        config={config}
      />
    </div>
  );
}
