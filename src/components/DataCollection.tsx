import React, { useState } from 'react';
import { 
  Book, 
  Heart, 
  MessageSquare, 
  Users, 
  Lightbulb,
  ChevronRight,
  Plus
} from 'lucide-react';

const collectionCategories = [
  {
    icon: Book,
    title: 'Истории жизни',
    description: 'Важные воспоминания, переживания и моменты, которые сформировали вас',
    color: 'from-blue-500 to-blue-600',
    items: ['Детские воспоминания', 'Карьерные достижения', 'Приключения и путешествия', 'Особые победы']
  },
  {
    icon: Heart,
    title: 'Отношения',
    description: 'Важные люди, ваши чувства к ним, что они для вас значат',
    color: 'from-purple-500 to-purple-600',
    items: ['Семейные истории', 'Дружба', 'Истории любви', 'Наставничество']
  },
  {
    icon: MessageSquare,
    title: 'Стиль общения',
    description: 'Как вы говорите, ваш юмор, выражения и способ объяснения',
    color: 'from-teal-500 to-teal-600',
    items: ['Любимые фразы', 'Стиль юмора', 'Способ давать советы', 'Реакции']
  },
  {
    icon: Users,
    title: 'Ценности и убеждения',
    description: 'За что вы стоите, ваши принципы и взгляд на мир',
    color: 'from-green-500 to-green-600',
    items: ['Основные ценности', 'Жизненная философия', 'Важные уроки', 'Убеждения']
  },
  {
    icon: Lightbulb,
    title: 'Мудрость и советы',
    description: 'Важные послания, наставления и мудрость, которой хотите поделиться',
    color: 'from-orange-500 to-orange-600',
    items: ['Жизненные уроки', 'Карьерные советы', 'Родительская мудрость', 'Послания будущему']
  }
];

export default function DataCollection() {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Что мы помогаем сохранить
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Наш деликатный, пошаговый процесс помогает запечатлеть суть того, кто вы есть, 
            одну историю за раз.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Category Selection */}
          <div className="space-y-4">
            {collectionCategories.map((category, index) => (
              <div
                key={index}
                className={`
                  bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 border-2
                  ${selectedCategory === index 
                    ? 'border-blue-300 shadow-lg' 
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }
                `}
                onClick={() => setSelectedCategory(index)}
              >
                <div className="flex items-center">
                  <div className={`bg-gradient-to-r ${category.color} p-3 rounded-lg`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                  <ChevronRight className={`
                    h-5 w-5 text-gray-400 transition-transform
                    ${selectedCategory === index ? 'rotate-90' : ''}
                  `} />
                </div>
              </div>
            ))}
          </div>

          {/* Category Details */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className={`bg-gradient-to-r ${collectionCategories[selectedCategory].color} p-4 rounded-xl`}>
                {React.createElement(collectionCategories[selectedCategory].icon, {
                  className: "h-8 w-8 text-white"
                })}
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {collectionCategories[selectedCategory].title}
                </h3>
                <p className="text-gray-600">
                  {collectionCategories[selectedCategory].description}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {collectionCategories[selectedCategory].items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
                <Plus className="h-5 w-5 mr-2" />
                Начать сохранение: {collectionCategories[selectedCategory].title}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}