import React, { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  Send, 
  ArrowLeft, 
  Brain, 
  Mic, 
  MicOff,
  Loader,
  CheckCircle,
  MessageCircle,
  Save,
  Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendChatMessage, createSystemPrompt, ChatMessage } from '../lib/openai';
import { analyzeUserResponses, AnalysisResult } from '../lib/analysisService';

interface ChatInterfaceProps {
  user: User;
  flowType: string;
  flowName: string;
  onBack: () => void;
}

interface ChatSession {
  id: string;
  current_step: number;
  status: string;
}

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  step_number: number;
  created_at: string;
}

interface ChatFlow {
  steps: string[];
}

interface UserResponse {
  question: string;
  answer: string;
  step_number: number;
}

export default function ChatInterface({ user, flowType, flowName, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [chatFlow, setChatFlow] = useState<ChatFlow | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, [flowType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Проверить, нужно ли показать кнопку сохранения
    if (session && chatFlow && session.current_step >= chatFlow.steps.length - 1) {
      setShowSaveButton(true);
    }
  }, [session, chatFlow]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      // Получить поток чата
      const { data: flowData, error: flowError } = await supabase
        .from('chat_flows')
        .select('steps')
        .eq('flow_type', flowType)
        .single();

      if (flowError) throw flowError;
      setChatFlow(flowData);

      // Проверить существующую сессию
      const { data: existingSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('flow_type', flowType)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let currentSession = existingSession;

      if (sessionError || !existingSession) {
        // Создать новую сессию
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            flow_type: flowType,
            current_step: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        currentSession = newSession;
      }

      setSession(currentSession);

      // Загрузить существующие сообщения
      const { data: existingMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSession.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (existingMessages && existingMessages.length > 0) {
        setMessages(existingMessages);
      } else {
        // Отправить первое сообщение от ИИ
        await sendInitialMessage(currentSession, flowData.steps);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const sendInitialMessage = async (session: ChatSession, steps: string[]) => {
    if (steps.length === 0) return;

    const initialMessage = steps[0];
    await saveMessage(session.id, 'ai', initialMessage, 0);
    
    setMessages([{
      id: Date.now().toString(),
      role: 'ai',
      content: initialMessage,
      step_number: 0,
      created_at: new Date().toISOString()
    }]);
  };

  const saveMessage = async (sessionId: string, role: 'ai' | 'user', content: string, stepNumber: number) => {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role,
        content,
        step_number: stepNumber
      });

    if (error) {
      console.error('Error saving message:', error);
    }
  };

  const saveUserResponse = async (question: string, answer: string, stepNumber: number) => {
    const { error } = await supabase
      .from('user_responses')
      .insert({
        user_id: user.id,
        session_id: session?.id,
        question,
        answer,
        flow_type: flowType,
        step_number: stepNumber
      });

    if (error) {
      console.error('Error saving user response:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !session || !chatFlow || loading) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setLoading(true);

    try {
      // Добавить сообщение пользователя
      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        step_number: session.current_step,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, newUserMessage]);
      await saveMessage(session.id, 'user', userMessage, session.current_step);

      // Сохранить ответ пользователя
      const currentQuestion = messages[messages.length - 1]?.content || '';
      await saveUserResponse(currentQuestion, userMessage, session.current_step);

      // Определить следующий шаг
      const nextStep = session.current_step + 1;
      let aiResponse = '';

      if (nextStep < chatFlow.steps.length) {
        // Использовать предопределённый вопрос
        aiResponse = chatFlow.steps[nextStep];
      } else {
        // Использовать OpenAI для генерации ответа
        const chatMessages: ChatMessage[] = [
          {
            role: 'system',
            content: createSystemPrompt(flowType, user.user_metadata?.full_name || 'Пользователь')
          },
          ...messages.slice(-5).map(msg => ({
            role: msg.role === 'ai' ? 'assistant' as const : 'user' as const,
            content: msg.content
          })),
          {
            role: 'user',
            content: userMessage
          }
        ];

        aiResponse = await sendChatMessage(chatMessages);
      }

      // Добавить ответ ИИ
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
        step_number: nextStep,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      await saveMessage(session.id, 'ai', aiResponse, nextStep);

      // Обновить сессию
      await supabase
        .from('chat_sessions')
        .update({ 
          current_step: nextStep,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id);

      setSession(prev => prev ? { ...prev, current_step: nextStep } : null);

      // Проверить завершение потока
      if (nextStep >= chatFlow.steps.length - 1) {
        setShowSaveButton(true);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Показать сообщение об ошибке
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'ai',
        content: 'Извините, произошла ошибка. Попробуйте ещё раз.',
        step_number: session.current_step,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!session || analyzing) return;

    setAnalyzing(true);

    try {
      // Получить все ответы пользователя
      const { data: responses, error } = await supabase
        .from('user_responses')
        .select('question, answer, step_number')
        .eq('session_id', session.id)
        .order('step_number', { ascending: true });

      if (error) throw error;

      if (!responses || responses.length === 0) {
        throw new Error('Нет ответов для анализа');
      }

      // Проанализировать ответы через ChatGPT
      const analysis = await analyzeUserResponses(
        user.id,
        session.id,
        flowType,
        responses
      );

      setAnalysisResult(analysis);

      // Обновить статус сессии
      await supabase
        .from('chat_sessions')
        .update({ status: 'completed' })
        .eq('id', session.id);

      // Добавить сообщение об успешном сохранении
      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'ai',
        content: '✨ Отлично! Ваши ответы проанализированы и сохранены. Теперь ваш цифровой портрет стал более полным и точным. Эта информация поможет создать более реалистичную цифровую копию вашей личности.',
        step_number: session.current_step + 1,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, successMessage]);
      setShowSaveButton(false);

    } catch (error) {
      console.error('Error saving progress:', error);
      
      // Показать сообщение об ошибке
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'ai',
        content: 'Произошла ошибка при сохранении прогресса. Попробуйте ещё раз.',
        step_number: session.current_step,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Здесь будет логика записи голоса
  };

  const getFlowIcon = () => {
    switch (flowType) {
      case 'self_discovery': return Brain;
      case 'stories': return MessageCircle;
      case 'voice_recording': return Mic;
      case 'wisdom': return CheckCircle;
      default: return Brain;
    }
  };

  const FlowIcon = getFlowIcon();
  const progress = Math.min(((session?.current_step || 0) / (chatFlow?.steps.length || 1)) * 100, 100);

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
              Назад к выбору
            </button>

            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <FlowIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{flowName}</h1>
                <p className="text-sm text-gray-500">
                  Шаг {(session?.current_step || 0) + 1} из {chatFlow?.steps.length || 0}
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
          {/* Progress Bar */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Прогресс</span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {progress >= 100 && showSaveButton && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleSaveProgress}
                  disabled={analyzing}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center mx-auto disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Анализируем ответы...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Сохранить прогресс
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  ИИ проанализирует ваши ответы для создания цифрового портрета
                </p>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
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
                    {new Date(message.created_at).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="text-sm">ИИ печатает...</span>
                  </div>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 animate-pulse text-purple-600" />
                    <span className="text-sm">Анализирую ваши ответы...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Analysis Result */}
          {analysisResult && (
            <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                Анализ завершён
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800">Описание личности:</h4>
                  <p className="text-gray-700 text-sm">{analysisResult.personalitySummary}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Стиль общения:</h4>
                  <p className="text-gray-700 text-sm">{analysisResult.communicationStyle}</p>
                </div>
                {analysisResult.keyValues.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800">Ключевые ценности:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {analysisResult.keyValues.map((value, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишите ваш ответ..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                  disabled={loading || analyzing}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                {flowType === 'voice_recording' && (
                  <button
                    onClick={toggleRecording}
                    className={`p-4 rounded-xl transition-colors ${
                      isRecording
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                )}
                
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || loading || analyzing}
                  className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}