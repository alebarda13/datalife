import React, { useState, useEffect } from 'react';
import { Brain, Mail, Lock, User, ArrowRight, Eye, EyeOff, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [cooldownTime, setCooldownTime] = useState(0);

  // Countdown effect for rate limit cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  const parseRateLimitError = (errorMessage: string): number => {
    // Extract seconds from messages like "you can only request this after 49 seconds"
    const match = errorMessage.match(/after (\d+) seconds/);
    return match ? parseInt(match[1], 10) : 60; // Default to 60 seconds if parsing fails
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
      }
    } catch (error: any) {
      // Check if it's a rate limit error
      if (error.message && error.message.includes('over_email_send_rate_limit')) {
        const waitTime = parseRateLimitError(error.message);
        setCooldownTime(waitTime);
        setError(`Слишком много попыток. Пожалуйста, подождите ${waitTime} секунд перед повторной попыткой.`);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = loading || cooldownTime > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">MOSSALITE</h1>
              <p className="text-sm text-gray-500">Цифровое наследие</p>
            </div>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Добро пожаловать!' : 'Создайте аккаунт'}
          </h2>
          <p className="text-gray-600">
            {isLogin 
              ? 'Войдите в свой аккаунт, чтобы продолжить создание цифрового Я'
              : 'Начните путь к цифровому наследию'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Полное имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isFormDisabled}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Введите ваше полное имя"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email адрес
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isFormDisabled}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Введите ваш email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isFormDisabled}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isFormDisabled}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className={`border rounded-xl p-4 ${
                cooldownTime > 0 
                  ? 'bg-orange-50 border-orange-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center">
                  {cooldownTime > 0 && <Clock className="h-5 w-5 text-orange-500 mr-2" />}
                  <p className={`text-sm ${
                    cooldownTime > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {cooldownTime > 0 
                      ? `Подождите ${cooldownTime} секунд перед повторной попыткой`
                      : error
                    }
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isFormDisabled}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : cooldownTime > 0 ? (
                <>
                  <Clock className="mr-2 h-5 w-5" />
                  Ожидание ({cooldownTime}с)
                </>
              ) : (
                <>
                  {isLogin ? 'Войти' : 'Создать аккаунт'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              disabled={isFormDisabled}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isLogin 
                ? 'Нет аккаунта? Зарегистрироваться'
                : 'Уже есть аккаунт? Войти'
              }
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Что вас ждёт после регистрации:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Создание вашей цифровой личности
            </li>
            <li className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              Сохранение воспоминаний и мудрости
            </li>
            <li className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
              Обучение ИИ вашему стилю общения
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}