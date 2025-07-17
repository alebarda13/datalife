import React from 'react';
import { Brain, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MOSSALITE</h3>
                <p className="text-gray-400 text-sm">Цифровое наследие</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Мы создаём технологии, которые позволяют сохранить человеческую личность 
              в цифровом формате, обеспечивая сохранение наследия и связь поколений.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Услуги</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Создание ИИ-копии</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Сохранение личности</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Цифровое наследие</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Семейный архив</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Поддержка</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Центр помощи</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Политика конфиденциальности</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Условия использования</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Связаться с нами</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 MOSSALITE. Технологии цифрового наследия.
          </p>
        </div>
      </div>
    </footer>
  );
}