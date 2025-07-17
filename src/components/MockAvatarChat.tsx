import React, { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ArrowLeft, 
  Send, 
  Brain, 
  Sparkles, 
  MessageCircle,
  User as UserIcon,
  Bot,
  Loader
} from 'lucide-react';

interface MockAvatarChatProps {
  user: User;
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'avatar';
  content: string;
  timestamp: string;
}

const mockResponses = {
  // Ответы о личности и характере
  'ценности': 'Мои главные ценности - это честность, семья и постоянное развитие. Я верю, что нужно всегда оставаться верным себе, но при этом не переставать учиться и расти как личность.',
  'решения': 'Я обычно принимаю решения обдуманно, взвешивая все "за" и "против". Сначала собираю информацию, потом советуюсь с близкими, и только потом действую. Импульсивность - не мой конек.',
  'мотивация': 'Меня мотивирует возможность создавать что-то полезное и видеть, как это помогает людям. Особенно вдохновляет, когда удается решить сложную задачу элегантным способом.',
  'характер': 'Я довольно спокойный и рассудительный человек, но могу быть очень упорным, когда дело касается важных для меня вещей. Друзья говорят, что я хороший слушатель.',

  // Ответы о семье и отношениях
  'семья': 'Семья для меня - это основа всего. У меня замечательная жена и двое детей. Мы стараемся проводить вместе как можно больше времени, особенно по выходным.',
  'дружба': 'Дружба - это взаимная поддержка и понимание. У меня не так много друзей, но те, что есть - проверены временем. Мы можем месяцами не общаться, но когда встречаемся, как будто расстались вчера.',
  'отношения': 'В отношениях главное - это честность и уважение. Нужно уметь слушать партнера и идти на компромиссы, но при этом не терять себя.',

  // Ответы о работе и карьере
  'работа': 'Я работаю в сфере технологий, занимаюсь разработкой продуктов. Мне нравится процесс создания чего-то нового от идеи до реализации.',
  'карьера': 'Моя цель - не просто подниматься по карьерной лестнице, а становиться экспертом в своей области и помогать развиваться команде.',
  'профессия': 'В работе меня привлекает возможность решать интересные задачи и работать с умными людьми. Каждый день приносит что-то новое.',

  // Ответы о хобби и интересах
  'хобби': 'В свободное время люблю читать, особенно научную фантастику и книги по психологии. Также увлекаюсь фотографией и иногда играю в настольные игры с семьей.',
  'книги': 'Из последнего прочитанного особенно понравился "Думай медленно... решай быстро" Канемана. Из художественной литературы люблю Стругацких и Лема.',
  'творчество': 'Фотография для меня - это способ замедлиться и увидеть красоту в обычных вещах. Особенно люблю снимать природу и уличные сцены.',

  // Ответы о жизненной философии
  'смысл жизни': 'Смысл жизни, по-моему, в том, чтобы оставить мир чуть лучше, чем он был до тебя. Это может быть через семью, работу или просто добрые дела.',
  'уроки': 'Главный урок, который я извлек из жизни - не стоит бояться ошибок. Ошибки - это опыт, а опыт - это мудрость.',
  'совет молодым': 'Молодому поколению я бы посоветовал не торопиться жить. Наслаждайтесь процессом, учитесь у каждого опыта и не забывайте о близких людях.',

  // Дефолтные ответы
  'default': [
    'Интересный вопрос! Дай мне подумать... Я бы сказал, что это зависит от многих факторов, но в целом я склоняюсь к тому, что...',
    'Знаешь, это напоминает мне одну историю из моей жизни. Когда-то я тоже сталкивался с похожей ситуацией...',
    'Хороший вопрос! Я всегда считал, что в таких вещах важно найти баланс между...',
    'Это довольно глубокая тема. По моему опыту, лучше всего подходить к этому с практической стороны...'
  ]
};

export default function MockAvatarChat({ user, onBack }: MockAvatarChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Добавить приветственное сообщение
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'avatar',
      content: `Привет! Я цифровой двойник Егора Орлова, обученный по его инициативе. Давай пообщаемся!

Вот список вопросов, на которые я могу ответить касаемо Егора:

🎯 **О личности и характере:**
• Какие у тебя главные ценности в жизни?
• Как ты принимаешь важные решения?
• Что тебя больше всего мотивирует?
• Какие у тебя сильные и слабые стороны?

👨‍👩‍👧‍👦 **О семье и отношениях:**
• Расскажи о своей семье
• Что для тебя значит дружба?
• Как ты строишь отношения с людьми?

💼 **О работе и карьере:**
• Чем ты занимаешься профессионально?
• Какие у тебя карьерные цели?
• Что тебе нравится в твоей работе?

🎨 **О хобби и интересах:**
• Чем ты увлекаешься в свободное время?
• Какие книги/фильмы тебе нравятся?
• Есть ли у тебя творческие увлечения?

🌟 **О жизненной философии:**
• В чём смысл жизни по-твоему?
• Какие уроки ты извлёк из жизни?
• Что бы ты посоветовал молодому поколению?

Просто задай любой вопрос, и я отвечу так, как ответил бы сам Егор! 😊`,
      timestamp: new Date().toISOString()
    };

    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findBestResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Поиск ключевых слов в сообщении пользователя
    for (const [key, response] of Object.entries(mockResponses)) {
      if (key !== 'default' && message.includes(key)) {
        return response as string;
      }
    }

    // Дополнительные ключевые слова
    if (message.includes('семь') || message.includes('родител') || message.includes('жен') || message.includes('дет')) {
      return mockResponses.семья;
    }
    if (message.includes('друз') || message.includes('дружб')) {
      return mockResponses.дружба;
    }
    if (message.includes('работ') || message.includes('профес') || message.includes('карьер')) {
      return mockResponses.работа;
    }
    if (message.includes('хобби') || message.includes('увлеч') || message.includes('свободн')) {
      return mockResponses.хобби;
    }
    if (message.includes('книг') || message.includes('чита')) {
      return mockResponses.книги;
    }
    if (message.includes('смысл') || message.includes('философ')) {
      return mockResponses['смысл жизни'];
    }
    if (message.includes('совет') || message.includes('молод')) {
      return mockResponses['совет молодым'];
    }

    // Возвращаем случайный дефолтный ответ
    const defaultResponses = mockResponses.default;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || loading) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setLoading(true);

    try {
      // Добавить сообщение пользователя
      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, newUserMessage]);

      // Показать индикатор печатания
      setIsTyping(true);

      // Имитация задержки ответа (1-3 секунды)
      const delay = Math.random() * 2000 + 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Найти подходящий ответ
      const avatarResponse = findBestResponse(userMessage);

      // Добавить ответ аватара
      const avatarMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'avatar',
        content: avatarResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, avatarMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'avatar',
        content: 'Извини, что-то пошло не так. Попробуй ещё раз!',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад к панели
            </button>

            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Чат с цифровой копией</h1>
                <p className="text-sm text-gray-500">
                  Демо-версия • Егор Орлов
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.user_metadata?.full_name || 'Пользователь'}
              </p>
              <p className="text-xs text-gray-500">MOSSALITE</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  🤖 Демо: Цифровая копия Егора Орлова
                </h3>
                <p className="text-gray-600 text-sm">
                  Это демонстрационная версия. Задавайте вопросы и получайте ответы в стиле Егора!
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-1"></div>
                  <div className="text-xs text-gray-500">Онлайн</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    DEMO
                  </div>
                  <div className="text-xs text-gray-500">Версия</div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md flex items-start space-x-3 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600'
                  }`}>
                    {message.role === 'user' ? (
                      <UserIcon className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Егор печатает...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишите сообщение цифровой копии Егора..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={2}
                  disabled={loading}
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || loading}
                className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                💡 Это демо-версия. Попробуйте спросить о ценностях, семье, работе или жизненной философии
              </p>
            </div>
          </div>
        </div>

        {/* Demo Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <MessageCircle className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Умные ответы</h3>
            <p className="text-gray-600 text-sm">
              ИИ анализирует ваш вопрос и отвечает в стиле Егора Орлова
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Sparkles className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Личностные черты</h3>
            <p className="text-gray-600 text-sm">
              Ответы основаны на характере, ценностях и опыте реального человека
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Brain className="h-8 w-8 text-teal-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Демо-режим</h3>
            <p className="text-gray-600 text-sm">
              Это демонстрация возможностей. В полной версии ответы будут ещё точнее
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}