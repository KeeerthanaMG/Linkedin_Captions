import React from 'react';
import { Linkedin, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-linkedin-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <Linkedin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                LinkedIn Caption Generator
              </h1>
              <p className="text-sm text-gray-600">
                Create engaging posts effortlessly
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-primary">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">
              AI-Powered
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
