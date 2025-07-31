import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Strikethrough, Underline, Smile, Type, 
  Undo, Redo, Trash2, List, ListOrdered 
} from 'lucide-react';

const FormattingToolbar = ({ 
  onFormat, 
  onEmoji, 
  onUndo, 
  onRedo, 
  onClear, 
  canUndo, 
  canRedo 
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState('common');
  const emojiPickerRef = useRef(null);
  
  const emojiCategories = {
    common: {
      name: 'Common',
      emojis: ['🚀', '✨', '🎯', '💡', '🔥', '👏', '🎉', '💪', '📍', '🎤', '📚', '💻', '🌟', '🎊', '🎈', '❤️', '👍', '🙌', '🎓', '🏆', '💼', '🤝', '🌱', '⚡']
    },
    professional: {
      name: 'Professional',
      emojis: ['💼', '📊', '📈', '🎯', '🏆', '💡', '🔧', '⚙️', '📋', '📝', '💻', '🖥️', '⌨️', '🖱️', '📱', '💾', '🔍', '📞', '📧', '📅', '⏰', '💰', '💳', '🏦']
    },
    celebration: {
      name: 'Celebration',
      emojis: ['🎉', '🎊', '🥳', '🎈', '🎁', '🍾', '🥂', '🎂', '🎭', '🎪', '🎨', '🎵', '🎶', '🎸', '🎤', '🎧', '🎬', '🎮', '🏅', '🥇', '🥈', '🥉', '👑', '🌟']
    },
    tech: {
      name: 'Tech',
      emojis: ['💻', '🖥️', '📱', '⌨️', '🖱️', '💾', '💿', '📀', '🔌', '🔋', '📡', '📺', '📷', '📹', '🎥', '💡', '🔧', '⚙️', '🛠️', '🔩', '⚡', '🌐', '📶', '📊']
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatButtons = [
    { type: 'bold', icon: Bold, label: 'Bold', shortcut: 'Ctrl+B' },
    { type: 'italic', icon: Italic, label: 'Italic', shortcut: 'Ctrl+I' },
    { type: 'bold-italic', icon: ({ className }) => (
      <div className={`${className} relative`}>
        <Bold className="w-3 h-3" />
        <Italic className="w-2 h-2 absolute -top-0.5 -right-0.5" />
      </div>
    ), label: 'Bold + Italic' },
    { type: 'strikethrough', icon: Strikethrough, label: 'Strikethrough' },
    { type: 'underline', icon: Underline, label: 'Underline', shortcut: 'Ctrl+U' },
  ];

  const listButtons = [
    { type: 'bullet', icon: List, label: 'Bullet List' },
    { type: 'numbered', icon: ListOrdered, label: 'Numbered List' },
  ];

  const actionButtons = [
    { action: onUndo, icon: Undo, label: 'Undo', disabled: !canUndo, shortcut: 'Ctrl+Z' },
    { action: onRedo, icon: Redo, label: 'Redo', disabled: !canRedo, shortcut: 'Ctrl+Y' },
    { action: onClear, icon: Trash2, label: 'Clear All', shortcut: 'Ctrl+A+Del' },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-50 to-linkedin-50 rounded-xl p-4 border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-sm font-semibold text-gray-700 mr-3 flex items-center">
            <Type className="w-4 h-4 mr-1" />
            Format:
          </span>
          
          {/* Text Formatting */}
          <div className="flex items-center space-x-1 bg-white rounded-lg p-1">
            {formatButtons.map((button) => (
              <button
                key={button.type}
                onClick={() => onFormat(button.type)}
                className="p-2 rounded-md hover:bg-gray-100 hover:shadow-sm transition-all duration-200 group"
                title={`${button.label} (Select text first) ${button.shortcut || ''}`}
              >
                <button.icon className="w-4 h-4 text-gray-600 group-hover:text-primary" />
              </button>
            ))}
          </div>
          
          {/* List Formatting */}
          <div className="flex items-center space-x-1 bg-white rounded-lg p-1">
            {listButtons.map((button) => (
              <button
                key={button.type}
                onClick={() => onFormat(button.type)}
                className="p-2 rounded-md hover:bg-gray-100 hover:shadow-sm transition-all duration-200 group"
                title={button.label}
              >
                <button.icon className="w-4 h-4 text-gray-600 group-hover:text-primary" />
              </button>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-1 bg-white rounded-lg p-1">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                disabled={button.disabled}
                className={`p-2 rounded-md transition-all duration-200 group ${
                  button.disabled 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'hover:bg-gray-100 hover:shadow-sm text-gray-600 hover:text-primary'
                }`}
                title={`${button.label} ${button.shortcut || ''}`}
              >
                <button.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
        
        {/* Emoji Picker */}
        <div className="relative" ref={emojiPickerRef}>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 bg-white rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all duration-200 group"
            title="Add emoji"
          >
            <Smile className="w-4 h-4 text-gray-600 group-hover:text-primary" />
          </button>
          
          {showEmojiPicker && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-80">
              {/* Category tabs */}
              <div className="flex border-b border-gray-100 p-2">
                {Object.entries(emojiCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setEmojiCategory(key)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      emojiCategory === key
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              {/* Emoji grid */}
              <div className="p-3 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-8 gap-1">
                  {emojiCategories[emojiCategory].emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onEmoji(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg text-lg transition-all hover:scale-110"
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 bg-white/50 rounded-lg p-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span>💡 Select text and click formatting buttons for LinkedIn-compatible styling</span>
          <span className="text-primary font-medium">Unicode formatting preserved</span>
        </div>
      </div>
    </div>
  );
};

export default FormattingToolbar;
