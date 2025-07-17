/*
  # Создание системы объединенного цифрового портрета

  1. Новые таблицы
    - `unified_portraits` - объединенные цифровые портреты пользователей
    - `avatar_conversations` - разговоры с аватаром для тестирования

  2. Безопасность
    - Включить RLS для всех таблиц
    - Политики доступа только для владельцев данных
*/

-- Таблица для объединенных цифровых портретов
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

-- Таблица для разговоров с аватаром
CREATE TABLE IF NOT EXISTS avatar_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  portrait_id uuid REFERENCES unified_portraits(id) ON DELETE CASCADE,
  messages jsonb NOT NULL DEFAULT '[]',
  session_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Включить RLS
ALTER TABLE unified_portraits ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_conversations ENABLE ROW LEVEL SECURITY;

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

-- Добавить индексы для производительности
CREATE INDEX IF NOT EXISTS idx_unified_portraits_user_id ON unified_portraits(user_id);
CREATE INDEX IF NOT EXISTS idx_unified_portraits_status ON unified_portraits(status);
CREATE INDEX IF NOT EXISTS idx_avatar_conversations_user_id ON avatar_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_avatar_conversations_portrait_id ON avatar_conversations(portrait_id);