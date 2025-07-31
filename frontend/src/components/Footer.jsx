import React from 'react';
import { Heart, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-linkedin-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for the LinkedIn community</span>
          </div>
          
          <div className="flex items-center justify-center space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          
          <p className="text-sm text-gray-500">
            © 2024 LinkedIn Caption Generator. Open source and free to use.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
