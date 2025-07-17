import React from 'react';
import { 
  Mic, 
  FileText, 
  Image, 
  Shield, 
  Clock, 
  Globe,
  Video,
  Headphones,
  Lock
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Запись голоса и аудио',
    description: 'Сохраните уникальное звучание вашего голоса, смеха и манеры речи.',
    color: 'text-blue-600'
  },
  {
    icon: FileText,
    title: 'Сбор историй',
    description: 'Документируйте жизненный опыт, мудрость и важные послания для близких.',
    color: 'text-purple-600'
  },
  {
    icon: Image,
    title: 'Визуальные воспоминания',
    description: 'Связывайте фотографии и моменты с историями для создания богатых воспоминаний.',
    color: 'text-teal-600'
  },
  {
    icon: Shield,
    title: 'Безопасность и приватность',
    description: 'Шифрование гарантирует защиту и конфиденциальность ваших воспоминаний.',
    color: 'text-green-600'
  },
  {
    icon: Clock,
    title: 'Всегда доступно',
    description: 'Ваш ИИ-компаньон доступен 24/7 для утешения и связи.',
    color: 'text-orange-600'
  },
  {
    icon: Globe,
    title: 'Семейный доступ',
    description: 'Контролируемый обмен с членами семьи через поколения и местоположения.',
    color: 'text-red-600'
  },
  {
    icon: Video,
    title: 'Видео интеграция',
    description: 'Скоро: видео воспоминания и выражения для улучшения опыта.',
    color: 'text-indigo-600'
  },
  {
    icon: Headphones,
    title: 'Естественные разговоры',
    description: 'ИИ отвечает в вашем уникальном стиле, создавая подлинные взаимодействия.',
    color: 'text-pink-600'
  },
  {
    icon: Lock,
    title: 'Контроль наследия',
    description: 'Вы решаете, кто может получить доступ к чему и когда, даже после вашей смерти.',
    color: 'text-gray-600'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Мощные возможности для
            <span className="block text-blue-600">вечных связей</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            За каждой функцией стоит любовь и уважение, направленные на создание 
            долговечных и значимых связей.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="ml-4 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}