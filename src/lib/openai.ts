const OPENAI_API_KEY = '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';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Извините, произошла ошибка при обработке ответа.';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Не удалось получить ответ от ИИ. Попробуйте позже.');
  }
}

export function createSystemPrompt(flowType: string, userName: string): string {
  const prompts = {
    self_discovery: `Ты - деликатный ИИ-помощник, который помогает человеку по имени ${userName} лучше понять себя для создания цифрового портрета. Твоя задача - задавать глубокие, но не навязчивые вопросы о личности, ценностях и характере. Будь тёплым, понимающим и поддерживающим. Отвечай на русском языке.`,
    
    stories: `Ты - внимательный слушатель, который помогает ${userName} сохранить важные жизненные истории и воспоминания. Задавай вопросы, которые помогут раскрыть значимые моменты жизни. Будь эмпатичным и заинтересованным. Отвечай на русском языке.`,
    
    voice_recording: `Ты помогаешь ${userName} записать голосовые послания и воспоминания. Направляй процесс записи, предлагай темы для записи и поддерживай пользователя. Будь ободряющим и практичным. Отвечай на русском языке.`,
    
    wisdom: `Ты помогаешь ${userName} сформулировать и сохранить жизненную мудрость, уроки и советы для будущих поколений. Задавай вопросы, которые помогут выразить глубокие жизненные истины. Будь мудрым и вдохновляющим. Отвечай на русском языке.`
  };

  return prompts[flowType as keyof typeof prompts] || prompts.self_discovery;
}