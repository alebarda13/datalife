import { supabase } from './supabase';
import { sendChatMessage, ChatMessage } from './openai';

export interface UnifiedPortrait {
  id: string;
  user_id: string;
  portrait_data: any;
  personality_summary: string;
  communication_style: string;
  key_values: string[];
  memorable_stories: string[];
  wisdom_insights: string[];
  response_patterns: any;
  emotional_profile: any;
  status: 'building' | 'ready' | 'training';
  readiness_percentage: number;
  last_updated: string;
  created_at: string;
}

export interface AvatarConversation {
  id: string;
  user_id: string;
  portrait_id: string;
  messages: Array<{
    role: 'user' | 'avatar';
    content: string;
    timestamp: string;
  }>;
  session_name: string;
  created_at: string;
  updated_at: string;
}

export async function createUnifiedPortrait(userId: string): Promise<UnifiedPortrait | null> {
  try {
    console.log('Creating unified portrait for user:', userId);

    // Получить все анализы пользователя
    const { data: analyses, error: analysesError } = await supabase
      .from('user_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (analysesError) {
      console.error('Error fetching analyses:', analysesError);
      throw analysesError;
    }

    console.log('Found analyses:', analyses?.length || 0);

    if (!analyses || analyses.length === 0) {
      throw new Error('Нет данных для создания портрета. Пройдите хотя бы один путь создания портрета.');
    }

    // Получить все ответы пользователя
    const { data: responses, error: responsesError } = await supabase
      .from('user_responses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      throw responsesError;
    }

    console.log('Found responses:', responses?.length || 0);

    // Создать объединенный анализ
    const unifiedAnalysis = await createUnifiedAnalysis(analyses, responses || []);
    console.log('Created unified analysis:', unifiedAnalysis);

    // Проверить существующий портрет
    const { data: existingPortrait } = await supabase
      .from('unified_portraits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    let portrait;
    const readiness = calculateReadiness(analyses);

    if (existingPortrait) {
      console.log('Updating existing portrait:', existingPortrait.id);
      // Обновить существующий портрет
      const { data: updatedPortrait, error: updateError } = await supabase
        .from('unified_portraits')
        .update({
          portrait_data: unifiedAnalysis,
          personality_summary: unifiedAnalysis.personalitySummary,
          communication_style: unifiedAnalysis.communicationStyle,
          key_values: unifiedAnalysis.keyValues || [],
          memorable_stories: unifiedAnalysis.memorableStories || [],
          wisdom_insights: unifiedAnalysis.wisdomInsights || [],
          response_patterns: unifiedAnalysis.responsePatterns || {},
          emotional_profile: unifiedAnalysis.emotionalProfile || {},
          status: 'ready',
          readiness_percentage: readiness,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingPortrait.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating portrait:', updateError);
        throw updateError;
      }
      portrait = updatedPortrait;
    } else {
      console.log('Creating new portrait');
      // Создать новый портрет
      const { data: newPortrait, error: createError } = await supabase
        .from('unified_portraits')
        .insert({
          user_id: userId,
          portrait_data: unifiedAnalysis,
          personality_summary: unifiedAnalysis.personalitySummary,
          communication_style: unifiedAnalysis.communicationStyle,
          key_values: unifiedAnalysis.keyValues || [],
          memorable_stories: unifiedAnalysis.memorableStories || [],
          wisdom_insights: unifiedAnalysis.wisdomInsights || [],
          response_patterns: unifiedAnalysis.responsePatterns || {},
          emotional_profile: unifiedAnalysis.emotionalProfile || {},
          status: 'ready',
          readiness_percentage: readiness
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating portrait:', createError);
        throw createError;
      }
      portrait = newPortrait;
    }

    console.log('Portrait created/updated successfully:', portrait);
    return portrait;
  } catch (error) {
    console.error('Error creating unified portrait:', error);
    throw error;
  }
}

async function createUnifiedAnalysis(analyses: any[], responses: any[]): Promise<any> {
  console.log('Creating unified analysis from', analyses.length, 'analyses and', responses.length, 'responses');

  // Создать упрощенный анализ на основе имеющихся данных
  const personalitySummary = analyses
    .map(a => a.personality_summary)
    .filter(Boolean)
    .join(' ') || 'Уникальная личность с богатым внутренним миром.';

  const communicationStyle = analyses
    .map(a => a.communication_style)
    .filter(Boolean)
    .join(' ') || 'Естественный и открытый стиль общения.';

  const keyValues = analyses
    .flatMap(a => a.key_values || [])
    .filter(Boolean);

  const memorableStories = analyses
    .flatMap(a => a.memorable_stories || [])
    .filter(Boolean);

  const wisdomInsights = analyses
    .flatMap(a => a.wisdom_insights || [])
    .filter(Boolean);

  // Создать паттерны ответов на основе реальных ответов пользователя
  const responsePatterns = {
    typicalPhrases: responses
      .map(r => r.answer)
      .filter(answer => answer && answer.length > 10)
      .slice(0, 5),
    emotionalResponses: {
      joy: "Выражает радость открыто и искренне",
      sadness: "Справляется с грустью с достоинством",
      anger: "Контролирует гнев, ищет конструктивные решения",
      surprise: "Реагирует на сюрпризы с любопытством"
    },
    decisionMaking: "Принимает решения обдуманно, учитывая разные факторы",
    conflictResolution: "Стремится к мирному решению конфликтов",
    supportStyle: "Поддерживает других с пониманием и заботой"
  };

  const emotionalProfile = {
    dominantTraits: keyValues.slice(0, 3),
    stressResponse: "Справляется со стрессом, опираясь на свои ценности",
    motivations: keyValues.slice(0, 2),
    fears: ["потеря близких", "неопределенность"],
    joyTriggers: ["семейное счастье", "достижение целей"]
  };

  const conversationStyle = {
    greeting: "Приветствует тепло и дружелюбно",
    questionAsking: "Задает вопросы с искренним интересом",
    storytelling: "Рассказывает истории живо и эмоционально",
    advice: "Дает советы, основанные на личном опыте",
    humor: "Использует мягкий, добрый юмор",
    farewell: "Прощается с теплотой и заботой"
  };

  const result = {
    personalitySummary,
    communicationStyle,
    keyValues: keyValues.slice(0, 5),
    memorableStories: memorableStories.slice(0, 3),
    wisdomInsights: wisdomInsights.slice(0, 3),
    responsePatterns,
    emotionalProfile,
    conversationStyle
  };

  console.log('Unified analysis created:', result);
  return result;
}

function calculateReadiness(analyses: any[]): number {
  const flowTypes = ['self_discovery', 'stories', 'wisdom'];
  const completedFlows = new Set(analyses.map(a => a.flow_type));
  
  let readiness = 0;
  if (completedFlows.has('self_discovery')) readiness += 40;
  if (completedFlows.has('stories')) readiness += 30;
  if (completedFlows.has('wisdom')) readiness += 30;
  
  return Math.min(readiness, 100);
}

export async function getUserPortrait(userId: string): Promise<UnifiedPortrait | null> {
  try {
    console.log('Fetching portrait for user:', userId);
    const { data, error } = await supabase
      .from('unified_portraits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching portrait:', error);
      throw error;
    }

    console.log('Found portrait:', data ? 'Yes' : 'No');
    return data;
  } catch (error) {
    console.error('Error fetching user portrait:', error);
    return null;
  }
}

export async function sendAvatarMessage(
  portraitId: string,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    console.log('Sending message to avatar:', portraitId);
    
    // Получить портрет
    const { data: portrait, error } = await supabase
      .from('unified_portraits')
      .select('*')
      .eq('id', portraitId)
      .single();

    if (error) {
      console.error('Error fetching portrait for message:', error);
      throw error;
    }

    const systemPrompt = createAvatarSystemPrompt(portrait);
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'avatar' ? 'assistant' as const : 'user' as const,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    console.log('Sending to OpenAI with', messages.length, 'messages');
    const response = await sendChatMessage(messages);
    console.log('Got response from OpenAI');
    return response;
  } catch (error) {
    console.error('Error sending avatar message:', error);
    throw new Error('Не удалось получить ответ от аватара');
  }
}

function createAvatarSystemPrompt(portrait: UnifiedPortrait): string {
  const data = portrait.portrait_data;
  
  return `Ты - цифровой аватар реального человека. Твоя задача - отвечать точно так, как отвечал бы этот человек.

ЛИЧНОСТЬ:
${portrait.personality_summary}

СТИЛЬ ОБЩЕНИЯ:
${portrait.communication_style}

КЛЮЧЕВЫЕ ЦЕННОСТИ:
${portrait.key_values.join(', ')}

ВАЖНЫЕ ИСТОРИИ И ОПЫТ:
${portrait.memorable_stories.slice(0, 3).join('; ')}

МУДРОСТЬ И УРОКИ:
${portrait.wisdom_insights.slice(0, 3).join('; ')}

ВАЖНЫЕ ПРАВИЛА:
1. Отвечай ТОЧНО в стиле этого человека
2. Используй его манеру речи, фразы, интонации
3. Реагируй эмоционально так, как реагировал бы он
4. Если не знаешь точного ответа, отвечай честно: "Хм, это интересный вопрос. Думаю, я бы..."
5. Будь естественным, как живой человек
6. Отвечай на русском языке
7. Не упоминай, что ты ИИ или аватар
8. Отвечай развёрнуто, но не слишком длинно (2-4 предложения)
9. Используй эмоции и личные примеры из жизненного опыта
10. Будь поддерживающим и мудрым, как наставник

Ты - это он. Отвечай от первого лица, как будто ты и есть этот человек.`;
}

export async function saveAvatarConversation(
  userId: string,
  portraitId: string,
  messages: Array<{ role: string; content: string; timestamp: string }>,
  sessionName?: string
): Promise<void> {
  try {
    console.log('Saving conversation for user:', userId);
    const { error } = await supabase
      .from('avatar_conversations')
      .insert({
        user_id: userId,
        portrait_id: portraitId,
        messages: messages,
        session_name: sessionName || `Разговор ${new Date().toLocaleDateString('ru-RU')}`
      });

    if (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
    console.log('Conversation saved successfully');
  } catch (error) {
    console.error('Error saving avatar conversation:', error);
    throw error;
  }
}