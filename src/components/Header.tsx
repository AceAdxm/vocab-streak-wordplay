
import React, { useState } from 'react';
import { ChevronDown, ExternalLink, User, Bug, Book, Menu, Trophy } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import VocabularyBook from './VocabularyBook';

const Header = () => {
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();

  const socialLinks = [
    { name: 'TikTok', url: 'https://www.tiktok.com/@aceadxm', icon: '🎵' },
    { name: 'Instagram', url: 'https://www.instagram.com/adxm.fr/?hl=en', icon: '📷' },
    { name: 'GitHub', url: 'https://github.com/AceAdxm', icon: '💻' },
  ];

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            VW
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-200">
                <Book className="w-4 h-4" />
                <span>Vocabulary</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <VocabularyBook />
            </PopoverContent>
          </Popover>
          
          <Link to="/leaderboard">
            <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-200">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>
          </Link>
          
          {user && (
            <Link to="/profile">
              <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-200">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </Link>
          )}
          
          <div className="relative">
            <button
              onClick={() => setIsMainDropdownOpen(!isMainDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMainDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isMainDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 animate-fade-in">
                <div className="py-2">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-700">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {user.email?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-300">{user.email}</span>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setIsMainDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors duration-200 text-left"
                      >
                        <User className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsMainDropdownOpen(false)}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors duration-200 text-left"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In / Sign Up</span>
                    </Link>
                  )}
                  
                  <a
                    href="https://github.com/AceAdxm/vocab-streak-wordplay/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setIsMainDropdownOpen(false)}
                  >
                    <Bug className="w-4 h-4" />
                    <span>Report Issues</span>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                  
                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <div className="px-4 py-2 text-sm text-gray-400">Support me</div>
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setIsMainDropdownOpen(false)}
                      >
                        <span className="text-lg">{link.icon}</span>
                        <span>{link.name}</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    ))}
                  </div>
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
