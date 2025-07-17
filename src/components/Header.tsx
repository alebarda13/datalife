import React from 'react';
import { Brain, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MOSSALITE</h1>
              <p className="text-xs text-gray-500">Связь поколений через технологии</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isLandingPage && (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                Как это работает
              </a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Возможности
              </a>
              <Link to="/stories" className="text-gray-600 hover:text-blue-600 transition-colors">
                Истории
              </Link>
              <Link to="/auth" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Начать
              </Link>
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isLandingPage && (
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && isLandingPage && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                Как это работает
              </a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Возможности
              </a>
              <Link to="/stories" className="text-gray-600 hover:text-blue-600 transition-colors">
                Истории
              </Link>
              <Link to="/auth" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full text-center">
                Начать
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}