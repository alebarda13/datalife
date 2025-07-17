import { sendChatMessage, ChatMessage } from './openai';
import { supabase } from './supabase';

export interface AnalysisResult {
  personalitySummary: string;
  communicationStyle: string;
  keyValues: string[];
  memorableStories: string[];
  wisdomInsights: string[];
  analysisData: any;
}

export async function analyzeUserResponses(
  userId: string,
  sessionId: string,
  flowType: string,
  responses: Array<{ question: string; answer: string; step_number: number }>
): Promise<AnalysisResult> {
  
  const analysisPrompts = {
    self_discovery: `
Проанализируй ответы пользователя на вопросы самопознания и создай детальный психологический портрет.

Ответы пользователя:
${responses.map(r => `Вопрос: ${r.question}\nОтвет: ${r.answer}`).join('\n\n')}

Создай анализ в следующем формате JSON:
{
  "personalitySummary": "Краткое описание личности (2-3 предложения)",
  "communicationStyle": "Описание стиля общения и речи",
  "keyValues": ["ценность1", "ценность2", "ценность3"],
  "coreTraits": ["черта1", "черта2", "черта3"],
  "emotionalProfile": "Описание эмоционального профиля",
  "decisionMaking": "Как принимает решения",
  "stressResponse": "Как справляется со стрессом",
  "motivations": ["мотивация1", "мотивация2"],
  "fears": ["страх1", "страх2"],
  "strengths": ["сильная сторона1", "сильная сторона2"]
}

Отвечай только JSON без дополнительного текста.`,

    stories: `
Проанализируй жизненные истории пользователя и выдели ключевые моменты для создания цифрового наследия.

Истории пользователя:
${responses.map(r => `Вопрос: ${r.question}\nИстория: ${r.answer}`).join('\n\n')}

Создай анализ в следующем формате JSON:
{
  "personalitySummary": "Краткое описание личности на основе историй",
  "memorableStories": ["важная история1", "важная история2", "важная история3"],
  "lifeThemes": ["тема жизни1", "тема жизни2"],
  "relationships": ["важные отношения и их влияние"],
  "achievements": ["достижения и гордые моменты"],
  "challenges": ["преодоленные трудности"],
  "formativeExperiences": ["формирующие опыты"],
  "familyValues": ["семейные ценности"],
  "culturalBackground": "Культурный и социальный контекст"
}

Отвечай только JSON без дополнительного текста.`,

    wisdom: `
Проанализируй мудрость и жизненные уроки пользователя для передачи будущим поколениям.

Мудрость пользователя:
${responses.map(r => `Вопрос: ${r.question}\nМудрость: ${r.answer}`).join('\n\n')}

Создай анализ в следующем формате JSON:
{
  "personalitySummary": "Описание мудрости и жизненной философии",
  "wisdomInsights": ["урок1", "урок2", "урок3"],
  "lifePhilosophy": "Основная жизненная философия",
  "adviceThemes": ["тема совета1", "тема совета2"],
  "valuesSystem": ["ценность1", "ценность2"],
  "practicalWisdom": ["практический совет1", "практический совет2"],
  "spiritualInsights": ["духовное понимание1", "духовное понимание2"],
  "relationshipWisdom": ["мудрость об отношениях"],
  "successPrinciples": ["принципы успеха"],
  "legacyMessages": ["послания потомкам"]
}

Отвечай только JSON без дополнительного текста.`,

    voice_recording: `
Проанализируй голосовые записи и текстовые ответы пользователя для понимания стиля общения.

Ответы пользователя:
${responses.map(r => `Контекст: ${r.question}\nОтвет: ${r.answer}`).join('\n\n')}

Создай анализ в следующем формате JSON:
{
  "personalitySummary": "Описание личности через стиль общения",
  "communicationStyle": "Детальное описание стиля общения",
  "speechPatterns": ["паттерн речи1", "паттерн речи2"],
  "emotionalTone": "Эмоциональный тон общения",
  "vocabulary": "Особенности словарного запаса",
  "expressiveness": "Уровень выразительности",
  "humor": "Стиль юмора (если есть)",
  "storytelling": "Манера рассказывания историй",
  "personalMessages": ["личное послание1", "личное послание2"]
}

Отвечай только JSON без дополнительного текста.`
  };

  try {
    const prompt = analysisPrompts[flowType as keyof typeof analysisPrompts] || analysisPrompts.self_discovery;
    
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'Ты - эксперт-психолог, который анализирует ответы людей для создания их цифрового портрета. Твоя задача - создать глубокий, точный и полезный анализ личности.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const analysisResponse = await sendChatMessage(messages);
    
    // Попытаться распарсить JSON ответ
    let analysisData;
    try {
      analysisData = JSON.parse(analysisResponse);
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', parseError);
      // Fallback анализ
      analysisData = {
        personalitySummary: 'Анализ личности на основе предоставленных ответов.',
        communicationStyle: 'Уникальный стиль общения пользователя.',
        keyValues: ['честность', 'семья', 'развитие'],
        coreTraits: ['thoughtful', 'caring', 'determined']
      };
    }

    // Извлечь стандартизированные поля
    const result: AnalysisResult = {
      personalitySummary: analysisData.personalitySummary || 'Анализ личности',
      communicationStyle: analysisData.communicationStyle || 'Стиль общения',
      keyValues: analysisData.keyValues || analysisData.valuesSystem || [],
      memorableStories: analysisData.memorableStories || analysisData.formativeExperiences || [],
      wisdomInsights: analysisData.wisdomInsights || analysisData.practicalWisdom || [],
      analysisData: analysisData
    };

    // Сохранить анализ в базу данных
    const { error } = await supabase
      .from('user_analysis')
      .insert({
        user_id: userId,
        session_id: sessionId,
        flow_type: flowType,
        analysis_data: analysisData,
        personality_summary: result.personalitySummary,
        communication_style: result.communicationStyle,
        key_values: result.keyValues,
        memorable_stories: result.memorableStories,
        wisdom_insights: result.wisdomInsights
      });

    if (error) {
      console.error('Error saving analysis:', error);
      throw new Error('Не удалось сохранить анализ');
    }

    return result;

  } catch (error) {
    console.error('Error analyzing responses:', error);
    throw new Error('Не удалось проанализировать ответы');
  }
}

export async function getUserAnalysis(userId: string, flowType?: string) {
  let query = supabase
    .from('user_analysis')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (flowType) {
    query = query.eq('flow_type', flowType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user analysis:', error);
    return null;
  }

  return data;
}