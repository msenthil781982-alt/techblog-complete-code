
import React, { useRef, useState, useEffect } from 'react';
import {
  FiBold,
  FiItalic,
  FiList,
  FiCode,
  FiLink,
  FiImage,
  FiEye,
  FiEdit3,
} from 'react-icons/fi';
import postService from '../../services/postService';
import toast from 'react-hot-toast';

const RichTextEditor = ({ value = '', onChange, placeholder = 'Write your article content here...' }) => {
  const editorRef = useRef(null);
  const [showHtml, setShowHtml] = useState(false);
  const [rawHtml, setRawHtml] = useState(value);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (!isInternalUpdate.current && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      setRawHtml(value);
    }
    isInternalUpdate.current = false;
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      isInternalUpdate.current = true;
      setRawHtml(html);
      onChange(html);
    }
  };

  const handleRawHtmlChange = (e) => {
    const html = e.target.value;
    setRawHtml(html);
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
    onChange(html);
  };

  const executeCommand = (command, val = null) => {
    if (showHtml) return;
    document.execCommand(command, false, val);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const handleInsertHeading = (tag) => {
    executeCommand('formatBlock', tag);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter destination link URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleInsertImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        toast.loading('Uploading inline image...', { id: 'inline-upload' });
        try {
          const res = await postService.uploadImage(formData);
          if (res?.url) {
            executeCommand('insertImage', res.url);
            toast.success('Image inserted!', { id: 'inline-upload' });
          }
        } catch {
          toast.error('Failed to upload image.', { id: 'inline-upload' });
        }
      }
    };
    input.click();
  };

  const btnClass =
    'p-1.5 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:outline-none text-xs font-semibold';

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">

      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">

        <button
          type="button"
          onClick={() => handleInsertHeading('<h2>')}
          className={btnClass}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => handleInsertHeading('<h3>')}
          className={btnClass}
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => handleInsertHeading('<p>')}
          className={btnClass}
          title="Normal Paragraph"
        >
          P
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className={btnClass}
          title="Bold"
        >
          <FiBold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className={btnClass}
          title="Italic"
        >
          <FiItalic className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className={btnClass}
          title="Bullet List"
        >
          <FiList className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className={btnClass}
          title="Numbered List"
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => handleInsertHeading('<blockquote>')}
          className={btnClass}
          title="Blockquote"
        >
          “
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={handleInsertLink}
          className={btnClass}
          title="Insert Link"
        >
          <FiLink className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleInsertImage}
          className={btnClass}
          title="Upload & Insert Image"
        >
          <FiImage className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => setShowHtml(!showHtml)}
          className={`ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
            showHtml
              ? 'bg-brand-600 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
          title="Toggle Raw HTML View"
        >
          {showHtml ? (
            <>
              <FiEye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </>
          ) : (
            <>
              <FiCode className="w-3.5 h-3.5" />
              <span>HTML</span>
            </>
          )}
        </button>
      </div>

      {showHtml ? (
        <textarea
          value={rawHtml}
          onChange={handleRawHtmlChange}
          rows={18}
          className="w-full p-4 font-mono text-xs text-gray-800 bg-slate-900 text-slate-100 focus:outline-none resize-y"
          placeholder="Enter raw HTML here..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="prose-custom min-h-[360px] p-5 focus:outline-none text-base leading-relaxed"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
