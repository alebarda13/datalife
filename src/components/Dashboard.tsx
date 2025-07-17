import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  Brain, 
  MessageCircle, 
  Book, 
  Mic, 
  Settings, 
  LogOut,
  ArrowRight,
  Sparkles,
  Heart,
  Users,
  Lightbulb,
  Bot,
  CheckCircle,
  AlertCircle,
  Loader,
  Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import ChatInterface from './ChatInterface';
import AvatarTester from './AvatarTester';
import { getUserPortrait, createUnifiedPortrait, UnifiedPortrait } from '../lib/portraitService';

interface DashboardProps {
  user: User;
}

const startingOptions = [
  {
    id: 'self_discovery',
    icon: Brain,
    title: 'Узнай себя заново',
    description: 'Ответьте на вопросы, которые помогут ИИ понять ваш характер, речь, стиль мышления и ценности.',
    color: 'from-blue-500 to-blue-600',
    recommended: true,
    required: true
  },
  {
    id: 'stories',
    icon: Book,
    title: 'Начать с историй',
    description: 'Расскажите о детстве, семье, важных поворотах в жизни.',
    color: 'from-purple-500 to-purple-600',
    required: true
  },
  {
    id: 'voice_recording',
    icon: Mic,
    title: 'Записать голос или аудио',
    description: 'Запишите первое послание для потомков или просто голосовое воспоминание.',
    color: 'from-teal-500 to-teal-600',
    required: false
  },
  {
    id: 'wisdom',
    icon: Lightbulb,
    title: 'Передать мудрость',
    description: 'Поделитесь уроками, которые вы бы хотели оставить навсегда.',
    color: 'from-orange-500 to-orange-600',
    required: true
  }
];

export default function Dashboard({ user }: DashboardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showMockChat, setShowMockChat] = useState(false);
  const [portrait, setPortrait] = useState<UnifiedPortrait | null>(null);
  const [completedFlows, setCompletedFlows] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingPortrait, setCreatingPortrait] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      console.log('Loading user data for:', user.id);

      // Загрузить портрет пользователя
      const userPortrait = await getUserPortrait(user.id);
      setPortrait(userPortrait);
      console.log('Portrait loaded:', userPortrait ? 'Yes' : 'No');

      // Загрузить завершенные потоки
      const { data: analyses, error } = await supabase
        .from('user_analysis')
        .select('flow_type')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading analyses:', error);
        throw error;
      }

      const flows = analyses?.map(a => a.flow_type) || [];
      setCompletedFlows(flows);
      console.log('Completed flows:', flows);

    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleStartOption = (optionId: string) => {
    setSelectedOption(optionId);
    setShowChat(true);
  };

  const handleBackFromChat = () => {
    setShowChat(false);
    setSelectedOption(null);
    loadUserData(); // Перезагрузить данные после завершения потока
  };

  // Проверить, выполнены ли все обязательные пути
  const requiredFlows = startingOptions.filter(option => option.required).map(option => option.id);
  const allRequiredCompleted = requiredFlows.every(flowId => completedFlows.includes(flowId));
  const missingRequiredFlows = requiredFlows.filter(flowId => !completedFlows.includes(flowId));

  const handleCreatePortrait = async () => {
    if (!allRequiredCompleted) {
      setError('Сначала пройдите все обязательные пути');
      return;
    }

    setCreatingPortrait(true);
    setError('');
    
    try {
      console.log('Creating portrait...');
      
      // Имитация анализа данных
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newPortrait = await createUnifiedPortrait(user.id);
      setPortrait(newPortrait);
      console.log('Portrait created successfully');
      
      // Сразу открыть чат с аватаром
      setTimeout(() => {
        setShowMockChat(true);
      }, 500);
      
    } catch (error: any) {
      console.error('Error creating portrait:', error);
      setError(error.message || 'Не удалось создать портрет');
    } finally {
      setCreatingPortrait(false);
    }
  };

  const handleTestAvatar = () => {
    console.log('Opening avatar tester');
    if (portrait) {
      setShowMockChat(true);
    }
  };

  const handleBackFromAvatarTester = () => {
    setShowMockChat(false);
  };

  if (showMockChat) {
    return (
      <AvatarTester
        user={user}
        portrait={portrait}
        onBack={handleBackFromAvatarTester}
      />
    );
  }

  if (showChat && selectedOption) {
    const option = startingOptions.find(opt => opt.id === selectedOption);
    return (
      <ChatInterface
        user={user}
        flowType={selectedOption}
        flowName={option?.title || ''}
        onBack={handleBackFromChat}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MOSSALITE</h1>
                <p className="text-xs text-gray-500">Личный кабинет</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.user_metadata?.full_name || 'Пользователь'}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Добро пожаловать в MOSSALITE
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Готовы сохранить
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              главное о себе?
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Этот процесс поможет вам передать всё, что важно: мысли, голос, опыт и мудрость — 
            тем, кого вы любите.
          </p>
        </div>

        {/* Portrait Status */}
        {portrait && (
          <div id="portrait-success" className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-12 border-2 border-green-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="bg-green-100 p-4 rounded-xl">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    🎉 Ваш цифровой портрет готов!
                  </h3>
                  <p className="text-gray-600 text-lg mb-2">
                    Готовность: <span className="font-bold text-green-600">{portrait.readiness_percentage}%</span> • 
                    Статус: <span className="font-bold text-green-600">Готов к тестированию</span>
                  </p>
                  <p className="text-gray-700 text-base max-w-2xl">
                    {portrait.personality_summary}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={handleTestAvatar}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <Bot className="h-8 w-8 mr-4" />
                  Тестировать аватар
                </button>
                
                <p className="text-sm text-gray-600 text-center max-w-xs">
                  Пообщайтесь со своей цифровой копией и проверьте, насколько точно она вас отражает
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Create Portrait Section */}
        {!portrait && (
          <div className={`rounded-2xl p-8 mb-12 shadow-lg border-2 ${
            allRequiredCompleted 
              ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
              : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
          }`}>
            <div className="text-center">
              {allRequiredCompleted ? (
                <Sparkles className="h-16 w-16 text-yellow-600 mx-auto mb-6" />
              ) : (
                <Lock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              )}
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {allRequiredCompleted 
                  ? '🚀 Готовы создать единый портрет?' 
                  : '🔒 Сначала пройдите обязательные пути'
                }
              </h3>
              
              {allRequiredCompleted ? (
                <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
                  У вас есть данные из <span className="font-bold">{completedFlows.length}</span> пути(ей). 
                  Создайте объединённый портрет и сразу начните общение с вашим цифровым двойником.
                </p>
              ) : (
                <div className="mb-6">
                  <p className="text-gray-700 text-lg mb-4 max-w-2xl mx-auto">
                    Для создания цифрового двойника необходимо пройти все обязательные пути:
                  </p>
                  <div className="bg-white rounded-xl p-4 max-w-md mx-auto">
                    <h4 className="font-semibold text-gray-900 mb-3">Обязательные пути:</h4>
                    <div className="space-y-2">
                      {requiredFlows.map(flowId => {
                        const option = startingOptions.find(opt => opt.id === flowId);
                        const isCompleted = completedFlows.includes(flowId);
                        return (
                          <div key={flowId} className="flex items-center justify-between">
                            <span className="text-gray-700">{option?.title}</span>
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {missingRequiredFlows.length > 0 && (
                      <p className="text-sm text-orange-600 mt-3">
                        Осталось пройти: {missingRequiredFlows.length} путь(ей)
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <button
                onClick={handleCreatePortrait}
                disabled={creatingPortrait || !allRequiredCompleted}
                className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center mx-auto shadow-xl ${
                  allRequiredCompleted && !creatingPortrait
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 hover:shadow-2xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {creatingPortrait ? (
                  <>
                    <Loader className="h-6 w-6 mr-3 animate-spin" />
                    Создание цифрового двойника...
                  </>
                ) : allRequiredCompleted ? (
                  <>
                    <Sparkles className="h-6 w-6 mr-3" />
                    Создать и протестировать двойника
                  </>
                ) : (
                  <>
                    <Lock className="h-6 w-6 mr-3" />
                    Создать и протестировать двойника
                  </>
                )}
              </button>
              
              <p className="text-sm text-gray-600 mt-4 max-w-md mx-auto">
                {allRequiredCompleted 
                  ? 'После создания вы сразу сможете пообщаться с вашей цифровой копией'
                  : 'Пройдите все обязательные пути, чтобы активировать эту функцию'
                }
              </p>
            </div>
          </div>
        )}

        {/* Starting Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {startingOptions.map((option) => (
            <div
              key={option.id}
              className={`
                bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 group relative
                ${selectedOption === option.id 
                  ? 'border-blue-300 shadow-xl' 
                  : 'border-gray-100 hover:border-gray-200'
                }
                ${completedFlows.includes(option.id) ? 'ring-2 ring-green-200' : ''}
              `}
              onClick={() => setSelectedOption(option.id)}
            >
              {completedFlows.includes(option.id) && (
                <div className="absolute top-4 right-4">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Завершено
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`bg-gradient-to-r ${option.color} p-4 rounded-xl group-hover:scale-110 transition-transform relative`}>
                  <option.icon className="h-8 w-8 text-white" />
                  {option.required && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {option.title}
                    </h3>
                    {option.recommended && !completedFlows.includes(option.id) && (
                      <span className="ml-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Рекомендуется
                      </span>
                    )}
                    {option.required && (
                      <span className="ml-3 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Обязательно
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {option.description}
                  </p>

                  <div className="flex items-center text-blue-600 font-medium">
                    {completedFlows.includes(option.id) ? 'Пройти ещё раз' : 'Выбрать этот путь'}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-6">
          <button
            onClick={() => selectedOption && handleStartOption(selectedOption)}
            disabled={selectedOption === null}
            className={`
              px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center mx-auto
              ${selectedOption !== null
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {selectedOption !== null ? (
              <>
                Начать цифровой портрет
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              'Выберите способ начала'
            )}
          </button>
          
          {selectedOption !== null && (
            <p className="mt-4 text-gray-600">
              Серия простых, тёплых вопросов, чтобы ИИ начал понимать ваш стиль общения и важные черты
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">{completedFlows.length}</div>
            <div className="text-gray-600 text-sm">Завершённых путей</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-gray-600 text-sm">Диалогов с ИИ</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Users className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-gray-600 text-sm">Связанных контактов</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Brain className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {portrait ? `${portrait.readiness_percentage}%` : '0%'}
            </div>
            <div className="text-gray-600 text-sm">Готовность ИИ</div>
          </div>
        </div>
      </main>
    </div>
  );
}