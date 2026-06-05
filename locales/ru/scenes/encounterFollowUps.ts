import type { Scene } from '@/lib/types/game'

/** Промежуточные сцены после выбора в NPC-встречах — не телепорт сразу в локацию. */
export const encounterFollowUpScenes: Record<string, Scene> = {
  whispers_mirror_shattered: {
    id: 'whispers_mirror_shattered',
    title: 'Осколки и Эхо',
    description: `
Зеркало рвётся **без звука** — стекло падает в воду, а отражение остаётся на коленях ещё миг, будто не заметило удара.

В трещинах — те же координаты, но теперь их можно прочесть и без отражения. Коридор впереди дышит катакомбами. Сзади — железный проход, куда шепчут без зеркал.
    `.trim(),
    options: [
      {
        id: 'catacombs',
        text: 'Идти в катакомбы — по координатам из осколков',
        targetSceneId: 'catacombs',
        effects: { sanity: -3, corruption: 1 },
      },
      {
        id: 'iron_passage',
        text: 'Свернуть в железный проход',
        targetSceneId: 'iron_passage',
        effects: { sanity: -2 },
      },
    ],
  },

  encounter_wax_pull_away: {
    id: 'encounter_wax_pull_away',
    title: 'Рука Отступает',
    description: `
Ты отрываешь запястье — воск **липнет** пальцами, как кожа чужого сна.

Паломник не догоняет. Он только кивает в сторону Уст: «Ты всё равно **считаешь** — просто другими губами.»

Дорога вниз узнаёт твой шаг. Пепел ложится ровнее, будто облегчён.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Спуститься к Устам — пока ритм ещё твой',
        targetSceneId: 'mouth',
        effects: { sanity: -2 },
      },
      {
        id: 'merchant',
        text: 'Вернуться к телеге — спросить, кого ещё считают',
        targetSceneId: 'merchant',
        effects: { sanity: -1 },
      },
    ],
  },

  encounter_wax_counted: {
    id: 'encounter_wax_counted',
    title: 'Счёт Закончен',
    description: `
Паломник отпускает запястье. На внутренней стороне маски — **твой** ритм, выдавленный воском.

«Готово. Теперь земля знает, когда ты **остановишься** — и не даст.»

Туман расступается. Внизу — лестница, которой не было, пока он считал.
    `.trim(),
    options: [
      {
        id: 'descent',
        text: 'Спуститься по лестнице — шаг уже не твой',
        targetSceneId: 'descent',
        effects: { corruption: 2, sanity: -3 },
      },
      {
        id: 'mouth',
        text: 'Рвануть к Устам — сорвать счёт ногами',
        targetSceneId: 'mouth',
        effects: { sanity: -5, corruption: 1 },
      },
    ],
  },

  encounter_wax_flee_side: {
    id: 'encounter_wax_flee_side',
    title: 'Боковой Шов',
    description: `
Ты ломаешь хватку — маска **трескается**, воск брызжет на камень.

Паломник не кричит. Он шепчет в трещину стены: «Проход **открыт**. Но боковые пути помнят тех, кто бежал без долга.»

Щель расширяется. Из неё пахнет сыростью катакомб — не Устами.
    `.trim(),
    options: [
      {
        id: 'catacombs',
        text: 'Вползти в боковой проход',
        targetSceneId: 'catacombs',
        effects: { sanity: -3 },
      },
      {
        id: 'mouth',
        text: 'Всё же идти к Устам — не прятаться',
        targetSceneId: 'mouth',
        effects: { sanity: -4, corruption: 1 },
      },
    ],
  },

  encounter_wax_fail_stagger: {
    id: 'encounter_wax_fail_stagger',
    title: 'Чужой Пульс',
    description: `
Ты дёрнулся слишком поздно. Паломник **улыбается** воском — улыбка не его.

На секунду ты забываешь имя камеры. Потом память возвращается — но ноги уже идут **в такт**, которого ты не выбирал.

Маска шепчет в спину: «Усты знают новый ритм. Не спорь.»
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Бежать к Устам — пока голова своя',
        targetSceneId: 'mouth',
        effects: { sanity: -6, corruption: 3 },
      },
      {
        id: 'catacombs',
        text: 'Врезаться в боковой шов — сбить ритм',
        targetSceneId: 'catacombs',
        effects: { sanity: -5, corruption: 2 },
      },
    ],
  },

  encounter_bell_silenced: {
    id: 'encounter_bell_silenced',
    title: 'Медь Замолкла',
    description: `
Ты прижимаешь ладонь к меди — звон **глушится**, как дыхание под водой.

Урод сжимается. На миг монастырь **нем** — и в этой немоте слышно, как где-то выше капает воск с колокола.

«Иди, — шепчет медь без голоса. — Но частота **осталась** в зубах.»
    `.trim(),
    options: [
      {
        id: 'bell',
        text: 'Подняться к колоколам — с новой тишиной',
        targetSceneId: 'bell',
        effects: { sanity: -3, addFlag: 'heard_the_bell' },
      },
      {
        id: 'monastery',
        text: 'Срезать в неф — пока звон не вернулся',
        targetSceneId: 'monastery',
        effects: { sanity: -2 },
      },
    ],
  },

  encounter_bell_retreat_nave: {
    id: 'encounter_bell_retreat_nave',
    title: 'Пустой Неф',
    description: `
Ты отступаешь — урод **не следует**, но звон идёт за тобой, тихий, как пульс.

Неф пуст. Скамьи покрыты пеплом, будто прихожане **испарились** на середине молитвы.

В глубине — арка к колоколам. Слева — зеркальная галерея, где шепчут без меди.
    `.trim(),
    options: [
      {
        id: 'monastery',
        text: 'Идти глубже в монастырь',
        targetSceneId: 'monastery',
        effects: { sanity: -1 },
      },
      {
        id: 'whispers_parlor',
        text: 'Свернуть в галерею шёпотов',
        targetSceneId: 'whispers_parlor',
        effects: { sanity: -3, corruption: 1 },
      },
    ],
  },

  encounter_bell_copper_taken: {
    id: 'encounter_bell_copper_taken',
    title: 'Полоска Меди',
    description: `
Нож скрипит по ребру — полоска **тёплая**, хотя урод давно не живёт.

Кровь не течёт. Течёт **звон** — тонкий, записанный на металл.

Синод услышит. Но сначала ты услышишь себя — в зеркале галереи, на полтона ниже.
    `.trim(),
    options: [
      {
        id: 'whispers_parlor',
        text: 'Нести медь в галерею шёпотов',
        targetSceneId: 'whispers_parlor',
        effects: { corruption: 3, sanity: -4 },
      },
      {
        id: 'monastery',
        text: 'Спрятать полоску и идти в неф',
        targetSceneId: 'monastery',
        effects: { sanity: -5, corruption: 2 },
      },
    ],
  },

  encounter_bell_fail_ringing: {
    id: 'encounter_bell_fail_ringing',
    title: 'Звон В Черепе',
    description: `
Медь **отбивает** тебя — звон не прекращается, когда урод замолкает.

Мир беззвучен снаружи. Внутри — колокол, который звонит **только** для тебя.

Неф кажется единственным местом, где частота может рассыпаться. Галерея — местом, где её запишут.
    `.trim(),
    options: [
      {
        id: 'monastery',
        text: 'Ползти в неф — искать тишину',
        targetSceneId: 'monastery',
        effects: { sanity: -8 },
      },
      {
        id: 'whispers_parlor',
        text: 'Идти туда, где шепчут без колоколов',
        targetSceneId: 'whispers_parlor',
        effects: { sanity: -6, corruption: 3 },
      },
    ],
  },

  encounter_choir_to_bell: {
    id: 'encounter_choir_to_bell',
    title: 'Гимн Обрывается',
    description: `
Ты зажимаешь уши — челюсть **визжит** выше, чем должна.

Гимн рвётся. На миг слышно только **колокол** вдали — чистый, без хора.

«Иди к звону, — шепчет третий голос. — Там **один** голос. Там проще.»
    `.trim(),
    options: [
      {
        id: 'bell',
        text: 'Идти на колокол — где один голос',
        targetSceneId: 'bell',
        effects: { sanity: -4, corruption: 2 },
      },
      {
        id: 'fracture_stairs',
        text: 'Спуститься в раскол — пока хор спорит',
        targetSceneId: 'fracture_stairs',
        effects: { sanity: -3, corruption: 1 },
      },
    ],
  },

  encounter_choir_hymn_reply: {
    id: 'encounter_choir_hymn_reply',
    title: 'Ответный Гимн',
    description: `
Ты шепчешь гимн — стены **отвечают** хором, которого здесь нет.

Левый и правый голос сходятся на твоём слове. Третий — **между** — записывает.

Свеча в руке загорается сама. Пламя смотрит в катакомбы, не в небо.
    `.trim(),
    options: [
      {
        id: 'light_candle',
        text: 'Следовать за пламенем вглубь',
        targetSceneId: 'light_candle',
        effects: { sanity: -6, corruption: 4 },
      },
      {
        id: 'catacombs',
        text: 'Тушить свечу и идти в катакомбы без огня',
        targetSceneId: 'catacombs',
        effects: { sanity: -5, corruption: 2 },
      },
    ],
  },

  encounter_choir_shatter_jaw: {
    id: 'encounter_choir_shatter_jaw',
    title: 'Пыль и Тишина',
    description: `
Камень **дробит** челюсть — гимн обрывается на полуслове, как приговор.

Пыль оседает на языке. На секунду ты вкусишь **тишину** — сладкую, неправильную.

Лестница в раскол открыта. Сверху доносится звон — будто монастырь одобрил жестокость.
    `.trim(),
    options: [
      {
        id: 'fracture_stairs',
        text: 'Спуститься по лестнице раскола',
        targetSceneId: 'fracture_stairs',
        effects: { sanity: -2, corruption: 2 },
      },
      {
        id: 'bell',
        text: 'Подняться к колоколу — звон зовёт',
        targetSceneId: 'bell',
        effects: { sanity: -4, corruption: 1 },
      },
    ],
  },

  encounter_synod_marked: {
    id: 'encounter_synod_marked',
    title: 'Строка в Книге',
    description: `
Адепт касается лба — не больно, **холодно**, как чернила.

На внутренней стороне века проступает знак. Синод не показывает его другим. Синод **помнит**.

«Усты должны знать, кто смотрит. Иди. Метка **откроет** — или закроет.»

Дорога к Устам кажется уже пройденной — хотя ты ещё не сделал шаг.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Спуститься к Устам с меткой',
        targetSceneId: 'mouth',
        effects: { sanity: -4, corruption: 2 },
      },
      {
        id: 'merchant',
        text: 'Сначала к телеге — предупредить Бездыханного',
        targetSceneId: 'merchant',
        effects: { sanity: -2 },
      },
    ],
  },

  encounter_synod_refused: {
    id: 'encounter_synod_refused',
    title: 'Пустая Строка',
    description: `
Адепт закрывает книгу — **без** имени. Это тоже запись.

«Синод помнит отказ. Бездыханный помнит **цену**.»

Он кивает на телегу. Купец уже смотрит — не поднимая головы, как всегда.
    `.trim(),
    options: [
      {
        id: 'merchant',
        text: 'Вернуться к телеге',
        targetSceneId: 'merchant',
        effects: { sanity: -1 },
      },
      {
        id: 'leave_cart',
        text: 'Не останавливаться — уйти от обоих',
        targetSceneId: 'leave_cart',
        effects: { sanity: -2 },
      },
    ],
  },

  encounter_synod_fail_inked: {
    id: 'encounter_synod_fail_inked',
    title: 'Дописано За Тебя',
    description: `
Ты дёрнулся — адепт **уже** закрыл строку. Чернила сухие. Долг **жив**.

«Синод не злится. Синод **фиксирует**. Принять — или отдать купцу как слух.»

Страница шелестит сама. На ней — не имя. **Предложение**.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Принять метку — Устам должны знать',
        targetSceneId: 'mouth',
        effects: { sanity: -5, corruption: 4, addFlag: 'synod_mark' },
      },
      {
        id: 'merchant',
        text: 'Нести долг к телеге — пусть Бездыханный видел',
        targetSceneId: 'merchant',
        effects: { sanity: -3 },
      },
    ],
  },

  encounter_heretic_whisper: {
    id: 'encounter_heretic_whisper',
    title: 'Ответ Машине',
    description: `
Ты шепчешь — не слова, **отсутствие** веры. Машина наверху **слышит**.

Шестерня останавливается. На зубьях проступает твой вопрос — уже с **ответом**, которого нет.

«Записано. Синод не прочтёт. Камера — **может**.»

В полу открывается яма — не глубина, а **вопрос**, сделанный пространством.
    `.trim(),
    options: [
      {
        id: 'jump_pit',
        text: 'Спуститься в яму — где ответ не нужен',
        targetSceneId: 'jump_pit',
        effects: { corruption: 4, sanity: -5, addFlag: 'met_heretic_cog' },
      },
      {
        id: 'blood_path',
        text: 'Идти по кровяному шву — Машина указала',
        targetSceneId: 'blood_path',
        effects: { corruption: 5, sanity: -4, addFlag: 'met_heretic_cog' },
      },
      {
        id: 'monastery',
        text: 'Отступить в монастырь — не смотреть в яму',
        targetSceneId: 'monastery',
        effects: { sanity: -3 },
      },
    ],
  },

  encounter_heretic_fail_cog: {
    id: 'encounter_heretic_fail_cog',
    title: 'Зубья Скользят',
    description: `
Пальцы **срываются** с металла — шестерня крутится быстрее, будто смеётся.

Чаша не принимает вопрос. Жар остаётся на коже, а зубья **холоднеют** снова.

Трансепт не рушится — он **терпелив**. Отступить в неф или ответить шёпотом — единственные честные выходы.
    `.trim(),
    options: [
      {
        id: 'monastery',
        text: 'Отступить в неф — руки ещё дрожат',
        targetSceneId: 'monastery',
        effects: { sanity: -6 },
      },
      {
        id: 'heretic_whisper_pit',
        text: 'Шепнуть ответ — раз силой не взять',
        requirements: { requiredOrigin: 'heretic' },
        targetSceneId: 'encounter_heretic_whisper',
        effects: { corruption: 4, sanity: -5, addFlag: 'heretic_answered' },
      },
    ],
  },

  encounter_heretic_cog_torn: {
    id: 'encounter_heretic_cog_torn',
    title: 'Шестерня в Чаше',
    description: `
Металл **визжит**, падая в чашу крови. Вопрос на зубьях стирается — не ответом, **жаром**.

Трансепт дрожит. Синод где-то выше кашляет пылью.

Из чаши поднимается пар — в нём на миг виден **путь** к яме и к монастырскому нефу.
    `.trim(),
    options: [
      {
        id: 'jump_pit',
        text: 'Следовать за паром в яму',
        targetSceneId: 'jump_pit',
        effects: { corruption: 5, sanity: -6, addFlag: 'met_heretic_cog' },
      },
      {
        id: 'monastery',
        text: 'Бежать в неф — пока трансепт не рухнул',
        targetSceneId: 'monastery',
        effects: { sanity: -4 },
      },
    ],
  },

  encounter_heretic_retreat: {
    id: 'encounter_heretic_retreat',
    title: 'Вопрос Остаётся',
    description: `
Ты отступаешь — шестерня **крутится** снова, медленнее, будто уважает трусость.

Вопрос не исчезает. Он **ждёт** в стене — не в трансепте.

Монастырь ближе, чем был. Колокол отзывается на шаг — не звоном, **сомнением**.
    `.trim(),
    options: [
      {
        id: 'monastery',
        text: 'Войти в монастырь — где вопросы имеют форму',
        targetSceneId: 'monastery',
        effects: { sanity: -1 },
      },
      {
        id: 'merchant',
        text: 'Вернуться на поверхность — к телеге',
        targetSceneId: 'merchant',
        effects: { sanity: -2 },
      },
    ],
  },

  merchant_reunion_mouth_path: {
    id: 'merchant_reunion_mouth_path',
    title: 'Слух на Языке',
    description: `
Бездыханный отпускает ладонь. На языке — **вкус** чужой памяти: колокол, маска, трещина.

«Не рассказывай Синоду. Иди к Устам — они **слушают** иначе, чем книга.»

Пепел на дороге ложится тоньше. Слепые фигуры у трещин не поднимают голов — **ждут**.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Спуститься к Устам со слухом',
        targetSceneId: 'mouth',
        effects: { sanity: -2, addFlag: 'met_breathless' },
      },
      {
        id: 'descent_echoes',
        text: 'Свернуть к эху — слух тянет не вниз',
        targetSceneId: 'descent_echoes',
        effects: { sanity: -3, corruption: 1 },
      },
    ],
  },

  encounter_synod_amend_mouth: {
    id: 'encounter_synod_amend_mouth',
    title: 'Книга Закрыта',
    description: `
Строка **стёрта** — не исчезла, а стала пустым местом. Синод редко оставляет пустоту.

Адепт кивает к Устам: «Пока книга закрыта — метка **спит**. Не буди её словом.»

Жар внизу зовёт. Пепел на дороге тяжелее обычного.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Спуститься к Устам — пока метка спит',
        targetSceneId: 'mouth',
        effects: { sanity: -2, corruption: 1 },
      },
      {
        id: 'merchant',
        text: 'Вернуться к телеге — долг не кончен',
        targetSceneId: 'merchant',
        effects: { sanity: 1 },
      },
    ],
  },
}
