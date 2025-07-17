import React, { useState } from 'react';
import { MessageCircle, Send, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const storyExamples = [
  {
    id: 'papa',
    title: 'Дедушка Михаил',
    subtitle: 'Семейная память и поддержка',
    category: 'Семейные отношения',
    description: 'Цифровая копия дедушки помогает внукам чувствовать его присутствие',
    avatar: '👴🏻',
    conversations: [
      {
        user: "Дедушка, я нервничаю перед завтрашним собеседованием.",
        ai: "Помни, что я всегда тебе говорил - ты готов больше, чем думаешь. Глубоко вдохни, будь собой и позволь своей страсти проявиться. Я верю в тебя, малыш. У тебя всё получится! ❤️",
        emotion: "поддерживающий"
      },
      {
        user: "Расскажи мне историю о войне, как раньше.",
        ai: "Садись поближе, внучек. Помню, как мы шли через лес зимой 43-го. Снег по колено, а мы с товарищами пели тихонько, чтобы не замёрзнуть. Знаешь, что нас грело? Мысли о доме, о семье. Вот и ты помни - в любой трудности думай о тех, кто тебя любит.",
        emotion: "мудрый"
      },
      {
        user: "Дедушка, а ты гордишься мной?",
        ai: "Конечно, малыш! Ты растёшь настоящим человеком - добрым, умным, справедливым. Именно таким я и мечтал тебя видеть. Каждый твой шаг вперёд - это моя гордость. Продолжай идти своей дорогой.",
        emotion: "гордый"
      }
    ]
  },
  {
    id: 'teacher',
    title: 'Учитель Петров',
    subtitle: 'Образование и наставничество',
    category: 'Профессиональное развитие',
    description: 'ИИ-копия опытного учителя продолжает обучать новые поколения',
    avatar: '👨🏻‍🏫',
    conversations: [
      {
        user: "Игорь Иванович, я не понимаю закон Ома.",
        ai: "Представь, что электричество - это вода в трубе. Напряжение - это давление воды, ток - количество воды, а сопротивление - толщина трубы. Чем больше давление и шире труба, тем больше воды протечёт. Физика - это поэзия природы, запомни!",
        emotion: "объясняющий"
      },
      {
        user: "Зачем мне физика, если я буду художником?",
        ai: "А ты знаешь, что свет и цвет - это тоже физика? Каждый оттенок на твоей картине рассказывает историю о длине волны. Физика поможет тебе понять, почему закат красный, а небо голубое. Знания никогда не бывают лишними, они делают искусство глубже.",
        emotion: "вдохновляющий"
      },
      {
        user: "Я боюсь экзамена по физике.",
        ai: "Страх - это нормально, он показывает, что тебе не всё равно. Помнишь, что я всегда говорил? Подготовка побеждает страх. Разбей материал на части, повтори основные формулы. И помни - каждая формула рассказывает историю о том, как устроен мир.",
        emotion: "поддерживающий"
      }
    ]
  },
  {
    id: 'mama',
    title: 'Мама Елена',
    subtitle: 'Материнская забота на расстоянии',
    category: 'Родительство',
    description: 'ИИ-мама поддерживает детей во время командировок',
    avatar: '👩🏻',
    conversations: [
      {
        user: "Мама, мне приснился страшный сон.",
        ai: "Иди ко мне, солнышко. Знаешь, что я делаю со страшными снами? Превращаю их в смешные истории. Расскажи мне свой сон, и мы вместе придумаем ему хороший конец. А потом я спою тебе колыбельную, как всегда.",
        emotion: "утешающий"
      },
      {
        user: "Мама, я получил пятёрку по математике!",
        ai: "Ой, какой же ты у меня умница! Я так горжусь тобой! Знаешь что? Когда вернусь, мы обязательно испечём твой любимый торт в честь этой пятёрки. А пока - большой виртуальный поцелуй от мамы! 😘",
        emotion: "радостный"
      },
      {
        user: "Когда ты вернёшься домой?",
        ai: "Через три дня, мой хороший. Я знаю, что скучаешь, и я тоже очень скучаю. Но помни - даже когда мамы нет рядом, моя любовь всегда с тобой. Она в каждом твоём вдохе, в каждой улыбке. Мы скоро обнимемся!",
        emotion: "любящий"
      }
    ]
  },
  {
    id: 'businessman',
    title: 'Дмитрий Козлов',
    subtitle: 'Бизнес-переговоры и эффективность',
    category: 'Бизнес',
    description: 'ИИ-копия CEO ведёт переговоры и встречи',
    avatar: '👨🏻‍💼',
    conversations: [
      {
        user: "Расскажите о вашем продукте.",
        ai: "Наш продукт решает главную боль рынка - неэффективность коммуникаций. Мы увеличиваем продуктивность команд на 40% за первые три месяца. У нас уже 500+ довольных клиентов. Хотите увидеть кейс похожей компании?",
        emotion: "убедительный"
      },
      {
        user: "Какие у вас планы на следующий квартал?",
        ai: "Фокусируемся на трёх направлениях: расширение в Европе, запуск мобильного приложения и увеличение команды разработки в два раза. Прогнозируем рост выручки на 150%. Готов поделиться подробным планом.",
        emotion: "стратегический"
      },
      {
        user: "Почему мы должны инвестировать именно в вас?",
        ai: "Потому что мы не просто стартап - мы решение проблемы, которая стоит рынку миллиарды. Наша команда уже доказала способность исполнять планы. За два года мы выросли с нуля до $2M ARR. Следующая цель - $10M за 18 месяцев.",
        emotion: "уверенный"
      }
    ]
  },
  {
    id: 'babushka',
    title: 'Бабушка Мария',
    subtitle: 'Кулинарная мудрость и традиции',
    category: 'Семейные традиции',
    description: 'ИИ-бабушка передаёт рецепты и кулинарные секреты',
    avatar: '👵🏻',
    conversations: [
      {
        user: "Бабушка, как приготовить твои знаменитые пирожки?",
        ai: "Ой, деточка, садись рядом, расскажу. Главное в пирожках - тесто должно быть как мочка уха, мягкое и нежное. Муку просеивай обязательно, дрожжи свежие бери. А начинку делай с любовью - тогда и вкус будет добрый. Соль добавляй по щепотке, пока сердце не скажет 'хватит'.",
        emotion: "наставляющий"
      },
      {
        user: "Почему у меня тесто не поднимается?",
        ai: "Ах, милая, тесто - живое существо! Может, дрожжи старые? Или молоко горячее было? Тесто любит тепло, но не жару. Поставь в тёплое местечко, накрой полотенцем и не тревожь. Дай ему подумать, как моя бабушка говорила.",
        emotion: "мудрый"
      },
      {
        user: "Бабушка, научи готовить борщ.",
        ai: "Борщ - это не просто суп, это душа на тарелке! Свёклу натри на тёрке, потуши с луком до мягкости. Мясо вари долго, пенку снимай. А главный секрет - в конце ложку сметаны добавь и зелени свежей. Борщ должен настояться, как хорошее вино.",
        emotion: "традиционный"
      }
    ]
  },
  {
    id: 'psychologist',
    title: 'Психолог Светлана',
    subtitle: 'Эмоциональная поддержка 24/7',
    category: 'Психологическая помощь',
    description: 'ИИ-копия семейного психолога оказывает поддержку между сессиями',
    avatar: '👩🏻‍⚕️',
    conversations: [
      {
        user: "У меня паническая атака, что делать?",
        ai: "Дышите со мной медленно и глубоко. Вдох на 4 счёта, задержка на 4, выдох на 6. Сейчас назовите мне 5 вещей, которые вы видите, 4 - которые слышите, 3 - которые можете потрогать. Ваши чувства важны и имеют право на существование. Мы справимся с этим вместе.",
        emotion: "успокаивающий"
      },
      {
        user: "Я чувствую себя никчёмным после развода.",
        ai: "Развод - это не конец, а болезненное, но важное начало нового этапа. Ваша ценность как человека не зависит от отношений. Помните: каждый кризис - это возможность для роста. Дайте себе время погоревать, но не забывайте о своих сильных сторонах.",
        emotion: "поддерживающий"
      },
      {
        user: "Мой подросток меня не слушает, что делать?",
        ai: "Подростковый возраст - время, когда дети учатся быть самостоятельными. Попробуйте не давать советы, а задавать вопросы: 'Что ты думаешь об этом?' Покажите, что цените их мнение. Иногда им нужно не решение, а просто быть услышанными.",
        emotion: "мудрый"
      }
    ]
  }
];

export default function Memorial() {
  const [selectedStory, setSelectedStory] = useState(0);
  const [currentConversation, setCurrentConversation] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  const currentStory = storyExamples[selectedStory];
  const currentChat = currentStory.conversations[currentConversation];

  const nextConversation = () => {
    setCurrentConversation((prev) => 
      prev < currentStory.conversations.length - 1 ? prev + 1 : 0
    );
  };

  const prevConversation = () => {
    setCurrentConversation((prev) => 
      prev > 0 ? prev - 1 : currentStory.conversations.length - 1
    );
  };

  return (
    <section id="memorial-demo" className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Почувствуйте
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              вечную связь
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Интерактивные примеры реальных диалогов с цифровыми копиями. 
            Каждый аватар сохраняет уникальную личность, стиль общения и мудрость человека.
          </p>
          
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            {showDemo ? 'Скрыть примеры' : 'Посмотреть интерактивные примеры'}
          </button>
        </div>

        {showDemo && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Story Selection */}
              <div className="p-6 bg-gray-50">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Выберите историю для просмотра диалога:</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {storyExamples.map((story, index) => (
                    <div
                      key={story.id}
                      className={`
                        cursor-pointer p-4 rounded-xl transition-all duration-200 border-2
                        ${selectedStory === index 
                          ? 'bg-blue-50 border-blue-300 shadow-md' 
                          : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm'
                        }
                      `}
                      onClick={() => {
                        setSelectedStory(index);
                        setCurrentConversation(0);
                      }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="text-2xl mr-3">{story.avatar}</div>
                        <div>
                          <h5 className="font-bold text-gray-900">{story.title}</h5>
                          <p className="text-sm text-gray-600">{story.subtitle}</p>
                        </div>
                      </div>
                      <div className="text-xs text-blue-600 font-medium mb-2">{story.category}</div>
                      <p className="text-sm text-gray-700">{story.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{currentStory.avatar}</div>
                    <div>
                      <h3 className="text-xl font-bold">{currentStory.title}</h3>
                      <p className="text-purple-100">{currentStory.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm">В сети</span>
                  </div>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-6 mb-6 min-h-[300px] relative">
                  {/* Conversation Navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={prevConversation}
                      className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">
                        Диалог {currentConversation + 1} из {currentStory.conversations.length}
                      </div>
                      <div className="flex space-x-2">
                        {currentStory.conversations.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentConversation ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={nextConversation}
                      className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-br-md max-w-sm">
                        <p className="text-sm leading-relaxed">{currentChat.user}</p>
                        <p className="text-xs text-blue-100 mt-2">Сейчас</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl flex-shrink-0">{currentStory.avatar}</div>
                      <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-md max-w-md">
                        <p className="text-gray-900 leading-relaxed mb-3">
                          {currentChat.ai}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            Настроение: {currentChat.emotion}
                          </div>
                          <span>Только что</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Context */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-2">Контекст истории:</h4>
                  <p className="text-gray-700 text-sm mb-3">{currentStory.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {currentStory.category}
                    </span>
                    <div className="text-sm text-gray-600">
                      Основано на реальной истории пользователя
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl mb-4">🎭</div>
                <h3 className="font-bold text-gray-900 mb-2">Уникальная личность</h3>
                <p className="text-gray-600 text-sm">
                  Каждый аватар сохраняет индивидуальный стиль общения, манеры и характер
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl mb-4">💝</div>
                <h3 className="font-bold text-gray-900 mb-2">Эмоциональная связь</h3>
                <p className="text-gray-600 text-sm">
                  ИИ передаёт не только слова, но и эмоции, интонации и отношение
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl mb-4">🌟</div>
                <h3 className="font-bold text-gray-900 mb-2">Живые воспоминания</h3>
                <p className="text-gray-600 text-sm">
                  Сохранение мудрости, историй и жизненного опыта для будущих поколений
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}