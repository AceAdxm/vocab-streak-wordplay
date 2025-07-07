
import React, { useState } from 'react';
import { ChevronDown, ExternalLink, User, Bug } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import IssuesBox from './IssuesBox';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const socialLinks = [
    { name: 'TikTok', url: 'https://tiktok.com', icon: '🎵' },
    { name: 'Instagram', url: 'https://instagram.com', icon: '📷' },
    { name: 'GitHub', url: 'https://github.com', icon: '💻' },
  ];

  const handleSignUp = () => {
    // Placeholder for sign up functionality
    alert('Sign up coming soon! This will track your daily login streaks, correct words, and progress.');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            VW
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSignUp}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105"
          >
            <User className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-200">
                <Bug className="w-4 h-4" />
                <span>Issues</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <IssuesBox />
            </PopoverContent>
          </Popover>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <span>Links</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 animate-fade-in">
                <div className="py-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.name}</span>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
