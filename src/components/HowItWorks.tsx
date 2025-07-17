import React from 'react';
import { MessageCircle, Brain, Heart, Users } from 'lucide-react';

const steps = [
  {
    icon: MessageCircle,
    title: 'Поделитесь историями',
    description: 'Записывайте воспоминания, мысли и переживания через разговоры, голосовые заметки и письменные истории.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Brain,
    title: 'Обучение ИИ',
    description: 'Наш продвинутый ИИ изучает ваш стиль общения, ценности, юмор и уникальные черты личности.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Heart,
    title: 'Сохранение сущности',
    description: 'Мы создаём цифрового компаньона, который передаёт вашу мудрость, любовь и взгляд на мир.',
    color: 'from-teal-500 to-teal-600'
  },
  {
    icon: Users,
    title: 'Связь поколений',
    description: 'Ваши потомки могут общаться вашей искусственной копией чувствуя ваше присутствие.',
    color: 'from-orange-500 to-orange-600'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Как работает создание цифровой копии
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Наш бережный и интуитивный процесс помогает передать главное — кто вы есть, шаг за шагом, одна история за другой.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group relative text-center"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              
              <div className={`bg-gradient-to-r ${step.color} p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform`}>
                <step.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Начать путешествие
          </button>
        </div>
      </div>
    </section>
  );
}