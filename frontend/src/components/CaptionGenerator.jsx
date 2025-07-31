import React, { useState, useRef } from 'react';
import { Copy, RefreshCw, Check, Edit3 } from 'lucide-react';
import FormattingToolbar from './FormattingToolbar';
import LinkedInPreview from './LinkedInPreview';

const CaptionGenerator = ({ caption, isGenerating, onRegenerate, formData }) => {
  const [editableCaption, setEditableCaption] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const textareaRef = useRef(null);

  React.useEffect(() => {
    setEditableCaption(caption);
    if (caption) {
      addToHistory(caption);
    }
  }, [caption]);

  const addToHistory = (text) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(text);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setEditableCaption(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setEditableCaption(history[historyIndex + 1]);
    }
  };

  const clearAll = () => {
    setEditableCaption('');
    addToHistory('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableCaption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleTextChange = (text) => {
    setEditableCaption(text);
    addToHistory(text);
  };

  const applyFormatting = (type) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editableCaption.substring(start, end);
    
    if (selectedText) {
      let formattedText = selectedText;
      
      switch (type) {
        case 'bold':
          formattedText = convertToBold(selectedText);
          break;
        case 'italic':
          formattedText = convertToItalic(selectedText);
          break;
        case 'bold-italic':
          formattedText = convertToBoldItalic(selectedText);
          break;
        case 'strikethrough':
          formattedText = convertToStrikethrough(selectedText);
          break;
        case 'underline':
          formattedText = convertToUnderline(selectedText);
          break;
        case 'bullet':
          formattedText = formatAsBulletList(selectedText);
          break;
        case 'numbered':
          formattedText = formatAsNumberedList(selectedText);
          break;
      }
      
      const newCaption = 
        editableCaption.substring(0, start) + 
        formattedText + 
        editableCaption.substring(end);
      
      handleTextChange(newCaption);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + formattedText.length);
      }, 0);
    }
  };

  const convertToBold = (text) => {
    const boldMap = {
      'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇',
      'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏',
      'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗',
      'Y': '𝐘', 'Z': '𝐙', 'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟',
      'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧',
      'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯',
      'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳', '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑',
      '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    };
    return text.split('').map(char => boldMap[char] || char).join('');
  };

  const convertToItalic = (text) => {
    const italicMap = {
      'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻',
      'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃',
      'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋',
      'Y': '𝑌', 'Z': '𝑍', 'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓',
      'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛',
      'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣',
      'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧'
    };
    return text.split('').map(char => italicMap[char] || char).join('');
  };

  const convertToBoldItalic = (text) => {
    const boldItalicMap = {
      'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯',
      'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷',
      'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿',
      'Y': '𝒀', 'Z': '𝒁', 'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇',
      'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏',
      'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗',
      'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
    };
    return text.split('').map(char => boldItalicMap[char] || char).join('');
  };

  const convertToStrikethrough = (text) => {
    return text.split('').map(char => char + '\u0336').join('');
  };

  const convertToUnderline = (text) => {
    return text.split('').map(char => char + '\u0332').join('');
  };

  const formatAsBulletList = (text) => {
    return text.split('\n').map(line => line.trim() ? `• ${line.trim()}` : line).join('\n');
  };

  const formatAsNumberedList = (text) => {
    let counter = 1;
    return text.split('\n').map(line => line.trim() ? `${counter++}. ${line.trim()}` : line).join('\n');
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newCaption = 
      editableCaption.substring(0, start) + 
      emoji + 
      editableCaption.substring(end);
    
    handleTextChange(newCaption);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  if (!caption && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl linkedin-shadow p-8 glass-effect">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
              <Edit3 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Your caption will appear here
            </h3>
            <p className="text-gray-600 text-lg">
              Fill out the form and click generate to create your LinkedIn caption
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Editor Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl linkedin-shadow p-6 glass-effect">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Caption Editor</h3>
          
          {caption && (
            <div className="flex space-x-2">
              <button
                onClick={onRegenerate}
                className="btn-secondary flex items-center space-x-2"
                disabled={isGenerating}
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
              
              <button
                onClick={handleCopy}
                className="btn-primary flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {isGenerating ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gradient-to-r from-linkedin-200 to-accent/30 rounded w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-linkedin-200 to-accent/30 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-linkedin-200 to-accent/30 rounded w-5/6"></div>
            <div className="h-4 bg-gradient-to-r from-linkedin-200 to-accent/30 rounded w-2/3"></div>
          </div>
        ) : (
          caption && (
            <>
              <FormattingToolbar 
                onFormat={applyFormatting}
                onEmoji={insertEmoji}
                onUndo={undo}
                onRedo={redo}
                onClear={clearAll}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
              />
              
              <div className="mt-4 space-y-3">
                <textarea
                  ref={textareaRef}
                  value={editableCaption}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="w-full h-80 p-4 border-2 border-gray-200 rounded-xl resize-none input-focus formatted-text bg-gray-50/50"
                  placeholder="Your generated caption will appear here..."
                />
                
                <div className="flex justify-between items-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>{editableCaption.length} characters</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>✨</span>
                    <span>LinkedIn Ready</span>
                  </span>
                </div>
              </div>
            </>
          )
        )}
      </div>

      {/* Preview Section */}
      {caption && !isGenerating && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl linkedin-shadow p-6 glass-effect">
          <h3 className="text-xl font-bold text-gray-900 mb-6">LinkedIn Preview</h3>
          <LinkedInPreview caption={editableCaption} />
        </div>
      )}
    </div>
  );
};

export default CaptionGenerator;
