import type { Scene } from '@/lib/types/game'

export const phaseScenes: Record<string, Scene> = {
  descent_echoes: {
    id: 'descent_echoes',
    title: 'Эхо в Завалах',
    description: `
Обрушенная кладка образует узкий коридор, освещённый светящимся грибком.

Каждый шаг возвращается впереди, а не сзади — словно кто-то идёт тем же путём навстречу.

На камне процарапано: «Не отвечай, когда зовёт твой собственный голос».
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Пробираться сквозь завалы',
        effects: { sanity: -3 },
      },
      {
        id: 'merchant',
        text: 'Ждать и прислушаться к источнику',
        effects: { corruption: 1 },
      },
    ],
  },

  descent_reliquary: {
    id: 'descent_reliquary',
    title: 'Разбитая Реликвария',
    description: `
В пепле лежит раскрытая, разбитая реликвария.

Внутри — костяшка пальца, обёрнутая в шёлк, который всё ещё потеет, несмотря на холод.

Когда ты приближаешься, кость указывает — едва заметно, намеренно — сразу на три разных выхода.
    `.trim(),
    options: [
      {
        id: 'monastery',
        text: 'Взять восточную арку',
        effects: { corruption: 2 },
      },
      {
        id: 'descent',
        text: 'Спуститься по лестнице вниз',
        effects: { sanity: -4 },
      },
    ],
  },

  whispers_parlor: {
    id: 'whispers_parlor',
    title: 'Шепчущая Гостиная',
    description: `
Комната с опрокинутыми стульями, расставленными в идеальный круг.

Голоса спорят о твоём следующем решении с пустых мест — каждый уверен, что знает, что ты выберешь.

Спор обрывается, когда все в один миг произносят твоё имя.
    `.trim(),
    options: [
      {
        id: 'bell',
        text: 'Идти за самым громким голосом',
        effects: { corruption: 3, sanity: -5 },
      },
      {
        id: 'exit_monastery',
        text: 'Уйти, не сделав выбора',
        effects: { sanity: -2 },
      },
    ],
  },

  whispers_mirror: {
    id: 'whispers_mirror',
    title: 'Потускневшее Зеркало',
    description: `
Во весь рост зеркало стоит одиноко в затопленном коридоре.

Твоё отражение преклоняет колени на секунду раньше тебя. Когда ты встаёшь, оно остаётся на коленях, склонив голову, словно слушая пол.

Трещины в стекле выводят координаты, которые может прочесть лишь отражение.
    `.trim(),
    options: [
      {
        id: 'catacombs',
        text: 'Разбить зеркало',
        effects: { sanity: -6, corruption: 2 },
      },
      {
        id: 'iron_passage',
        text: 'Произнести координаты вслух',
        requirements: { intelligence: 6 },
        effects: { corruption: 4 },
      },
    ],
  },

  fracture_stairs: {
    id: 'fracture_stairs',
    title: 'Лестница, Что Забывает',
    description: `
Ступени меняют число при каждом моргании.

Ты считаешь тринадцать, потом девять, потом больше, чем удержит память.

Детский отпечаток ладони на перилах всё ещё тёплый.
    `.trim(),
    options: [
      {
        id: 'descent',
        text: 'Спуститься всё равно',
        effects: { sanity: -7, corruption: 3 },
      },
      {
        id: 'mouth',
        text: 'Откупиться памятью — бежать назад к твёрдой земле',
        effects: { sanity: -12, corruption: 4 },
      },
    ],
  },

  fracture_choir: {
    id: 'fracture_choir',
    title: 'Расколотый Хор',
    description: `
Два одинаковых хора поют с противоположных сторон треснувшего нефа.

Оба утверждают, что они — настоящая паства. Оба замолкают, когда ты закрываешь одно ухо, и продолжают, когда закрываешь оба.

Гимн описывает твоё прибытие до того, как ты сделаешь первый шаг внутрь.
    `.trim(),
    options: [
      {
        id: 'bell',
        text: 'Присоединиться к левому хору',
        effects: { corruption: 5 },
      },
      {
        id: 'light_candle',
        text: 'Присоединиться к правому хору',
        effects: { sanity: -5, corruption: 3 },
      },
      {
        id: 'whispers_mirror',
        text: 'Слушать третий голос — не выбирая сторону',
        requirements: { requiredFlag: 'choir_split' },
        effects: { sanity: -4, corruption: 2 },
      },
    ],
  },

  communion_vein: {
    id: 'communion_vein',
    title: 'Вскрытая Жила',
    description: `
Стену содрали.

Под камнем течёт светящийся канал медленного света — на прикосновение он отзывается, как живая плоть.

Он дарит тепло, ясность и абсолютную уверенность, что ты принадлежишь ему изнутри.
    `.trim(),
    options: [
      {
        id: 'jump_pit',
        text: 'Опустить руку в канал',
        effects: { corruption: 7, sanity: -7 },
      },
      {
        id: 'blood_path',
        text: 'Отрезать образец',
        requirements: { strength: 6 },
        effects: { corruption: 6, sanity: -4 },
      },
      {
        id: 'whispers_parlor',
        text: 'Отдернуть руку и отступить',
        effects: { sanity: 2, corruption: -1 },
      },
    ],
  },

  communion_throne: {
    id: 'communion_throne',
    title: 'Пустой Трон',
    description: `
Трон из спаянных позвонков ждёт в зале, что пахнет ладаном и хирургией.

Он твоего размера. Он всегда был твоего размера.

Когда ты отказываешься сесть, комната перестраивается, пока отказ не станет невозможной геометрией.
    `.trim(),
    options: [
      {
        id: 'sarcophagus_tunnel',
        text: 'Сесть на одно сердцебиение',
        effects: { corruption: 8, sanity: -8 },
      },
      {
        id: 'ash_path',
        text: 'Сломать подлокотники и бежать',
        requirements: { strength: 7 },
        effects: { sanity: -5, corruption: 4 },
      },
      {
        id: 'collapse_threshold',
        text: 'Вынуть чёрный позвонок из спинки трона',
        requirements: { intelligence: 7 },
        effects: {
          addArtifact: 'black_vertebrae',
          corruption: 6,
          sanity: -8,
        },
      },
    ],
  },

  collapse_threshold: {
    id: 'collapse_threshold',
    title: 'Порог Распада',
    description: `
Реальность истончается до пергамента.

Ты видишь каждую версию этого коридора, наложенную друг на друга — на каждой труп в твоей одежде.

Версии начинают сливаться. Скоро останется лишь один исход.
    `.trim(),
    options: [
      {
        id: 'jump_pit',
        text: 'Шагнуть в слитый исход',
        effects: { corruption: 10, sanity: -9 },
      },
      {
        id: 'read_writings',
        text: 'Произнести то, что помнишь о себе',
        requirements: { intelligence: 7 },
        effects: { sanity: 5, corruption: 5 },
      },
      {
        id: 'heretic_whisper_pit',
        text: 'Прошептать ответ под камнем в слитый исход',
        targetSceneId: 'jump_pit',
        requirements: { requiredFlag: 'heretic_answered' },
        effects: { corruption: 8, sanity: -6 },
      },
    ],
  },

  collapse_maw: {
    id: 'collapse_maw',
    title: 'Последняя Преддверная',
    description: `
Здесь архитектура кончается.

За последней аркой не тьма, а отсутствие — пространство, где не рождается даже страх.

Что-то необъятное замечает твоё внимание и поворачивается к тебе с терпением геологии.
    `.trim(),
    options: [
      {
        id: 'collapse_threshold',
        text: 'Шагнуть на порог — не вверх, а глубже в слияние',
        targetSceneId: 'collapse_threshold',
        effects: { corruption: 12, sanity: -10 },
      },
      {
        id: 'exit_monastery',
        text: 'Вцепиться в последний цельный камень и платить за отступление',
        effects: { sanity: -14, corruption: 6 },
      },
    ],
  },
}
