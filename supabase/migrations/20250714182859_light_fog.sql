/*
  # Полная схема базы данных для MOSSALITE

  1. Основные таблицы
    - `profiles` - профили пользователей
    - `chat_flows` - потоки чата для разных типов взаимодействия
    - `chat_sessions` - сессии чата пользователей
    - `chat_messages` - сообщения в чате
    - `user_responses` - ответы пользователей на вопросы
    - `user_analysis` - анализ ответов пользователей
    - `unified_portraits` - объединенные цифровые портреты
    - `avatar_conversations` - разговоры с аватаром

  2. Безопасность
    - Включить RLS для всех таблиц
    - Политики доступа только для владельцев данных
*/

-- Таблица профилей пользователей
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Таблица потоков чата
CREATE TABLE IF NOT EXISTS chat_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_type text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  steps text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Таблица сессий чата
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  flow_type text NOT NULL,
  current_step integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Таблица сообщений чата
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('ai', 'user')),
  content text NOT NULL,
  step_number integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Таблица ответов пользователей
CREATE TABLE IF NOT EXISTS user_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  flow_type text NOT NULL,
  step_number integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Таблица анализа пользователей
CREATE TABLE IF NOT EXISTS user_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  flow_type text NOT NULL,
  analysis_data jsonb NOT NULL DEFAULT '{}',
  personality_summary text,
  communication_style text,
  key_values text[] DEFAULT '{}',
  memorable_stories text[] DEFAULT '{}',
  wisdom_insights text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Таблица объединенных портретов
CREATE TABLE IF NOT EXISTS unified_portraits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  portrait_data jsonb NOT NULL DEFAULT '{}',
  personality_summary text,
  communication_style text,
  key_values text[] DEFAULT '{}',
  memorable_stories text[] DEFAULT '{}',
  wisdom_insights text[] DEFAULT '{}',
  response_patterns jsonb DEFAULT '{}',
  emotional_profile jsonb DEFAULT '{}',
  status text DEFAULT 'building' CHECK (status IN ('building', 'ready', 'training')),
  readiness_percentage integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Таблица разговоров с аватаром
CREATE TABLE IF NOT EXISTS avatar_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  portrait_id uuid REFERENCES unified_portraits(id) ON DELETE CASCADE,
  messages jsonb NOT NULL DEFAULT '[]',
  session_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Включить RLS для всех таблиц
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_portraits ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_conversations ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
CREATE POLICY "Users can view and update own profile"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Политики для chat_flows (публичное чтение)
CREATE POLICY "Anyone can read chat flows"
  ON chat_flows
  FOR SELECT
  TO authenticated
  USING (true);

-- Политики для chat_sessions
CREATE POLICY "Users can manage own chat sessions"
  ON chat_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Политики для chat_messages
CREATE POLICY "Users can manage own chat messages"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Политики для user_responses
CREATE POLICY "Users can manage own responses"
  ON user_responses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Политики для user_analysis
CREATE POLICY "Users can manage own analysis"
  ON user_analysis
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Политики для unified_portraits
CREATE POLICY "Users can manage own portraits"
  ON unified_portraits
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Политики для avatar_conversations
CREATE POLICY "Users can manage own avatar conversations"
  ON avatar_conversations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Создать индексы для производительности
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_flow_type ON chat_sessions(flow_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_responses_session_id ON user_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_user_analysis_user_id ON user_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_unified_portraits_user_id ON unified_portraits(user_id);
CREATE INDEX IF NOT EXISTS idx_unified_portraits_status ON unified_portraits(status);
CREATE INDEX IF NOT EXISTS idx_avatar_conversations_user_id ON avatar_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_avatar_conversations_portrait_id ON avatar_conversations(portrait_id);

-- Вставить начальные данные для потоков чата
INSERT INTO chat_flows (flow_type, name, description, steps) VALUES
(
  'self_discovery',
  'Узнай себя заново',
  'Ответьте на вопросы, которые помогут ИИ понять ваш характер, речь, стиль мышления и ценности.',
  ARRAY[
    'Привет! Я помогу вам создать цифровой портрет. Давайте начнём с простого вопроса: расскажите немного о себе - кто вы и чем занимаетесь?',
    'Интересно! А что для вас самое важное в жизни? Какие ценности вы считаете основными?',
    'Расскажите о своём характере. Как бы вас описали близкие друзья?',
    'Как вы обычно принимаете важные решения? Что влияет на ваш выбор?',
    'Что вас больше всего мотивирует и вдохновляет в жизни?',
    'Как вы справляетесь со стрессом и трудными ситуациями?',
    'Расскажите о своих увлечениях и хобби. Что приносит вам радость?',
    'Какие качества вы больше всего цените в людях?',
    'Есть ли у вас жизненный девиз или принцип, которым вы руководствуетесь?',
    'Спасибо за откровенные ответы! Теперь у меня есть хорошее представление о вашей личности.'
  ]
),
(
  'stories',
  'Начать с историй',
  'Расскажите о детстве, семье, важных поворотах в жизни.',
  ARRAY[
    'Давайте сохраним ваши важные истории! Расскажите мне о самом ярком воспоминании из детства.',
    'Расскажите о своей семье. Кто оказал на вас наибольшее влияние?',
    'Какое событие в вашей жизни изменило вас больше всего?',
    'Расскажите историю, которой вы особенно гордитесь.',
    'Какой урок жизни был для вас самым важным?',
    'Расскажите о человеке, который многое для вас значит.',
    'Какая традиция или обычай особенно дороги вашему сердцу?',
    'Расскажите о моменте, когда вы поняли что-то важное о себе.',
    'Какую историю вы бы хотели передать будущим поколениям?',
    'Благодарю за эти прекрасные истории! Они помогут создать живой портрет вашей личности.'
  ]
),
(
  'wisdom',
  'Передать мудрость',
  'Поделитесь уроками, которые вы бы хотели оставить навсегда.',
  ARRAY[
    'Поделитесь своей мудростью! Какой самый важный жизненный урок вы бы передали молодому поколению?',
    'Что бы вы посоветовали человеку, который только начинает свой жизненный путь?',
    'Какие ошибки в жизни научили вас больше всего?',
    'Что вы считаете секретом счастливой жизни?',
    'Какой совет о отношениях и любви вы считаете самым ценным?',
    'Что бы вы сказали о важности семьи и дружбы?',
    'Какие принципы помогают вам в трудные времена?',
    'Что бы вы хотели, чтобы люди помнили о вас?',
    'Какое послание вы бы оставили своим потомкам?',
    'Спасибо за вашу мудрость! Эти слова будут переданы через поколения.'
  ]
),
(
  'voice_recording',
  'Записать голос или аудио',
  'Запишите первое послание для потомков или просто голосовое воспоминание.',
  ARRAY[
    'Давайте сохраним ваш голос и манеру речи! Расскажите что-то важное, что хотели бы передать близким.',
    'Поделитесь воспоминанием, которое особенно дорого вашему сердцу.',
    'Расскажите о своих мечтах и планах на будущее.',
    'Какие слова поддержки вы бы сказали себе в трудную минуту?',
    'Поделитесь своими мыслями о жизни и её смысле.',
    'Расскажите историю, которая всегда вызывает у вас улыбку.',
    'Какие пожелания вы бы оставили своим близким?',
    'Поделитесь тем, за что вы благодарны в жизни.',
    'Расскажите о своих надеждах на будущее.',
    'Прекрасно! Ваш голос и эмоции теперь сохранены для будущих поколений.'
  ]
)
ON CONFLICT (flow_type) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  steps = EXCLUDED.steps;