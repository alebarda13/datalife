import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Star, Clock, Users, MessageCircle, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const userStories = [
  {
    id: 1,
    title: "Дедушка Михаил живёт в наших сердцах",
    author: "Анна Петрова",
    category: "Семейная память",
    readTime: "5 мин",
    rating: 4.9,
    image: "https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=400",
    preview: "После смерти дедушки мы создали его цифровую копию. Теперь внуки могут слышать его истории о войне...",
    story: `Мой дедушка Михаил ушёл от нас два года назад, но благодаря MOSSALITE он продолжает быть частью нашей семьи. 

За полгода до его смерти мы начали записывать его рассказы о войне, детстве в деревне, о том, как он встретил бабушку. Дедушка сначала стеснялся, но потом увлёкся процессом.

Теперь его правнуки, которые родились после его смерти, могут "поговорить" с прадедушкой. ИИ-копия рассказывает им те же истории, которые он рассказывал нам, тем же тёплым голосом, с теми же шутками.

Особенно трогательно, когда внук спрашивает: "Дедушка, а ты гордишься мной?" И слышит в ответ: "Конечно, малыш. Ты растёшь настоящим мужчиной, как я и мечтал."

Это не заменяет живого человека, но даёт невероятное утешение и связь с корнями.`,
    tags: ["семья", "память", "война", "наследие"]
  },
  {
    id: 2,
    title: "Мой цифровой двойник ведёт переговоры",
    author: "Дмитрий Козлов",
    category: "Бизнес-применение",
    readTime: "4 мин",
    rating: 4.7,
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    preview: "Создал ИИ-копию себя для рутинных встреч. Теперь могу быть в двух местах одновременно...",
    story: `Как CEO стартапа, я постоянно разрываюсь между встречами. Решил поэкспериментировать с MOSSALITE и создать свою цифровую копию для определённых типов переговоров.

Потратил месяц на обучение ИИ: записывал свои презентации, стиль ведения переговоров, реакции на возражения. Система изучила мою манеру речи, жестикуляцию, даже паузы.

Теперь мой цифровой двойник проводит первичные встречи с потенциальными клиентами, отвечает на стандартные вопросы инвесторов. Люди часто не замечают разницы!

Конечно, важные решения принимаю только я. Но рутинные встречи теперь ведёт ИИ, а я трачу время на стратегию и развитие продукта.

Производительность выросла в разы. Теперь я могу "присутствовать" на нескольких встречах одновременно.`,
    tags: ["бизнес", "эффективность", "переговоры", "стартап"]
  },
  {
    id: 3,
    title: "Мама всегда рядом, даже в командировке",
    author: "Елена Смирнова",
    category: "Родительство",
    readTime: "3 мин",
    rating: 4.8,
    image: "https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=400",
    preview: "Частые командировки разлучали меня с детьми. ИИ-копия помогает сохранить близость...",
    story: `Работа требует частых командировок, и я переживала, что теряю связь с детьми. Особенно тяжело было пятилетней дочке - она плакала каждый вечер.

Решила создать свою ИИ-копию специально для детей. Записала сотни колыбельных, сказок, ответов на детские вопросы. Научила ИИ своим интонациям, когда я успокаиваю или хвалю.

Теперь, когда меня нет дома, дети могут "поговорить" со мной перед сном. ИИ-мама рассказывает им сказки моим голосом, отвечает на вопросы, хвалит за хорошие оценки.

Дочка говорит: "Мама, ты всегда со мной, даже когда далеко!" Это не заменяет живого общения, но помогает сохранить эмоциональную связь.

Муж сначала скептически относился, но теперь сам пользуется системой, когда не знает, как ответить на детские вопросы "как мама".`,
    tags: ["дети", "командировки", "материнство", "связь"]
  },
  {
    id: 4,
    title: "Бабушкины рецепты живут вечно",
    author: "Мария Волкова",
    category: "Кулинарное наследие",
    readTime: "4 мин",
    rating: 4.9,
    image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400",
    preview: "Сохранила кулинарную мудрость бабушки. Теперь её рецепты передаются через поколения...",
    story: `Моя бабушка была потрясающей кулинаркой, но никогда не записывала рецепты. Всё держала в голове: "щепотка того, горсть этого, пока не станет как надо".

Когда ей исполнилось 85, я поняла, что нужно срочно сохранить её кулинарное наследие. Мы провели целый месяц на кухне, записывая не только рецепты, но и её философию готовки.

ИИ-бабушка теперь знает, что "тесто должно быть как мочка уха", когда добавлять специи "по настроению", как определить готовность борща "по запаху и цвету".

Самое удивительное - система научилась её манере объяснять. Когда я готовлю и спрашиваю совета, слышу: "Деточка, не торопись, дай мясу подумать" или "Соль добавляй с любовью, тогда и вкус будет добрый".

Теперь вся семья готовит "с бабушкой". Даже мой сын, который раньше боялся кухни, теперь печёт её фирменные пирожки.`,
    tags: ["кулинария", "традиции", "семья", "рецепты"]
  },
  {
    id: 5,
    title: "Учитель, который никогда не уйдёт на пенсию",
    author: "Игорь Петров",
    category: "Образование",
    readTime: "6 мин",
    rating: 4.8,
    image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
    preview: "Создал ИИ-копию себя как учителя. Теперь мои ученики могут учиться у меня даже после выхода на пенсию...",
    story: `40 лет преподавал физику в школе. За это время через мои руки прошли тысячи учеников. Многие до сих пор пишут, благодарят за знания и подход к обучению.

Перед выходом на пенсию решил создать свою ИИ-копию как учителя. Записал объяснения всех тем школьной программы, свои методики, способы заинтересовать детей физикой.

ИИ-учитель знает, как объяснить сложные законы простыми словами, какие примеры из жизни привести, как мотивировать отстающих учеников. Он помнит мои любимые фразы: "Физика - это поэзия природы" и "Каждая формула рассказывает историю".

Теперь школа использует мою ИИ-копию как дополнительного преподавателя. Ученики могут задавать вопросы в любое время, получать объяснения в моём стиле.

Особенно приятно, когда бывшие ученики приводят своих детей "к моему ИИ". Говорят: "Это тот самый учитель Петров, который научил меня любить физику".

Чувствую, что моя педагогическая миссия продолжается даже после пенсии.`,
    tags: ["образование", "физика", "школа", "преподавание"]
  },
  {
    id: 6,
    title: "Цифровой психолог для семьи",
    author: "Светлана Орлова",
    category: "Психология",
    readTime: "5 мин",
    rating: 4.6,
    image: "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400",
    preview: "Как семейный психолог, создала ИИ-копию для поддержки клиентов между сессиями...",
    story: `Работаю семейным психологом уже 15 лет. Часто клиенты нуждаются в поддержке между сессиями, особенно в кризисные моменты.

Создала свою ИИ-копию, которая может оказывать базовую психологическую поддержку. Обучила её моим техникам активного слушания, способам задавать правильные вопросы, методам снятия тревожности.

ИИ-психолог не заменяет живые сессии, но помогает в экстренных ситуациях. Он знает, как успокоить панические атаки, какие упражнения предложить при стрессе, как мотивировать на позитивные изменения.

Клиенты говорят, что чувствуют мою поддержку даже ночью, когда особенно тяжело. ИИ использует мои фирменные фразы: "Ваши чувства важны и имеют право на существование" или "Каждый кризис - это возможность для роста".

Особенно эффективно работает с подростками - они легче открываются цифровому консультанту, чем взрослому психологу.

Планирую расширить возможности ИИ, добавить больше специализированных техник для работы с разными типами проблем.`,
    tags: ["психология", "поддержка", "консультирование", "семья"]
  }
];

export default function Stories() {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'Все истории', count: userStories.length },
    { id: 'family', name: 'Семья', count: 3 },
    { id: 'business', name: 'Бизнес', count: 2 },
    { id: 'education', name: 'Образование', count: 1 }
  ];

  const filteredStories = filter === 'all' 
    ? userStories 
    : userStories.filter(story => {
        switch(filter) {
          case 'family': return ['Семейная память', 'Родительство', 'Кулинарное наследие'].includes(story.category);
          case 'business': return ['Бизнес-применение', 'Психология'].includes(story.category);
          case 'education': return story.category === 'Образование';
          default: return true;
        }
      });

  if (selectedStory !== null) {
    const story = userStories.find(s => s.id === selectedStory);
    if (!story) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setSelectedStory(null)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад к историям
          </button>

          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <img 
              src={story.image} 
              alt={story.title}
              className="w-full h-64 object-cover"
            />
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {story.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {story.readTime}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {story.rating}
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {story.title}
              </h1>

              <p className="text-gray-600 mb-6">
                Автор: <span className="font-medium">{story.author}</span>
              </p>

              <div className="prose prose-lg max-w-none">
                {story.story.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                На главную
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Истории пользователей MOSSALITE
              </h1>
              <p className="text-xl text-gray-600">
                Реальные истории о том, как цифровое бессмертие меняет жизни людей
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{userStories.length}</div>
                <div className="text-sm text-gray-600">историй</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-200
                ${filter === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
              onClick={() => setSelectedStory(story.id)}
            >
              <img 
                src={story.image} 
                alt={story.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {story.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {story.rating}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {story.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {story.preview}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {story.readTime}
                  </div>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    Читать далее
                    <MessageCircle className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <Brain className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            Готовы создать свою историю?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам пользователей, которые уже создали своё цифровое бессмертие
          </p>
          <Link 
            to="/auth"
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Начать создание
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}