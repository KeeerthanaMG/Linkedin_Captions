import React from 'react';
import { MoreHorizontal, ThumbsUp, MessageCircle, Repeat2, Send, Globe } from 'lucide-react';

const LinkedInPreview = ({ caption }) => {
  const formatTime = () => {
    return '12h';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 linkedin-post-preview max-w-full shadow-sm">
      {/* Post header */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Profile picture */}
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="profile-name text-sm font-semibold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer">
                  Alex Dahud
                </h4>
                <p className="profile-title text-xs text-gray-600 mt-0.5">
                  Growth at Typegrow | Helping you grow LinkedIn audience with AI
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="post-time text-xs text-gray-500">
                    {formatTime()}
                  </span>
                  <span className="text-gray-400">•</span>
                  <Globe className="w-3 h-3 text-gray-500" />
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Post content */}
        <div className="mt-3 ml-15">
          <div className="post-content text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
            {caption || 'Start writing and your post will appear here..\n\nYou can add images, links, #hashtags and emojis 😊\n\nThis line will appear below the more...'}
          </div>
        </div>
      </div>

      {/* Engagement metrics */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-2">
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 bg-blue-600 rounded-full border border-white flex items-center justify-center">
                <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
              </div>
              <div className="w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center">
                <span className="text-white text-xs leading-none">❤</span>
              </div>
            </div>
            <span className="ml-1">57</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>24 comments</span>
            <span>6 reposts</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-2 py-1">
        <div className="flex items-center justify-around">
          <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex-1">
            <ThumbsUp className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Like</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex-1">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Comment</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex-1">
            <Repeat2 className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Repost</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 px-4 py-3 rounded-md hover:bg-gray-50 transition-colors flex-1">
            <Send className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPreview;
