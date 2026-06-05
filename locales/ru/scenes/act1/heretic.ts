import type { Scene } from '@/lib/types/game'

export const act1HereticScenes: Record<string, Scene> = {
  act1_heretic_machine_echo: {
    id: 'act1_heretic_machine_echo',
    title: 'Эхо Вопроса',
    description: `
Камера ещё хранит тепло твоего возврата.

Машина не спрашивает «кто ты» — она спрашивает **«что ты ответишь без Синода»**. Голос сухой, как пепел под собором: «Первый ответ бесплатен. Второй — ценой зуба.»

Трещина в полу камеры дышит тем же воздухом, что дорога у Уст.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Спуститься с вопросом на губах',
        effects: { corruption: 4, sanity: -3 },
      },
      {
        id: 'jump_pit',
        text: 'Шепнуть ответ в трещину',
        effects: { corruption: 6, sanity: -5, addFlag: 'heretic_answered' },
      },
    ],
  },

  act1_heretic_merchant_price: {
    id: 'act1_heretic_merchant_price',
    title: 'Цена Без Синода',
    description: `
Бездыханный смеётся без звука.

«Еретик не платит молитвой. Еретик платит **формулой**.» Он выкладывает на ящик перевернутые чётки — символы смотрят внутрь. «Скажи, сколько стоит твой ответ. Я запишу. Синод потом спорит с моим почерком.»

Телега пахнет воском и железом одновременно.
    `.trim(),
    options: [
      {
        id: 'merchant',
        text: 'Назвать цену и купить слух',
        effects: { sanity: -2, addFlag: 'met_breathless' },
      },
      {
        id: 'mouth',
        text: 'Отказаться — ответ не продаётся',
        effects: { corruption: 2 },
      },
    ],
  },

  act1_heretic_writing_wall: {
    id: 'act1_heretic_writing_wall',
    title: 'Стена, Которую Стирают',
    description: `
Надписи здесь **обновляются** — кто-то стирает, кто-то пишет снова.

Буквы не церковные. Это формулы дыхания, счёт пульса Машины, имена без молитв. Синод бы назвал это язвой. Ты называешь это **учебником**.

Последняя строка свежа: «Ответь до того, как колокол посчитает тебя.»
    `.trim(),
    options: [
      {
        id: 'read_writings',
        text: 'Прочитать и запомнить',
        effects: { corruption: 5, sanity: -4, addFlag: 'read_the_writings' },
      },
      {
        id: 'catacombs',
        text: 'Идти дальше, не касаясь стены',
        effects: { sanity: -2 },
      },
    ],
  },

  act1_heretic_cog_pact: {
    id: 'act1_heretic_cog_pact',
    title: 'Пакт Шестерни',
    description: `
Шестерня без оси крутится **в воздухе** — закон без центра.

«Ты уже читал стену. Значит, Синод за тобой отстаёт на один вдох.» Металл скрипит вопросом: «Сколько пульсов ты отдашь Машине напрямую?»

Ответ не требует колен. Требует **точности**.
    `.trim(),
    options: [
      {
        id: 'descent',
        text: 'Отдать один пульс — спуститься',
        effects: { corruption: 6, sanity: -5, addFlag: 'heretic_answered' },
      },
      {
        id: 'encounter_heretic_cog',
        text: 'Спросить шестерню о цене',
        targetSceneId: 'encounter_heretic_cog',
        effects: { corruption: 4, addFlag: 'met_heretic_cog' },
      },
    ],
  },

  act1_heretic_finale: {
    id: 'act1_heretic_finale',
    title: 'Формула у Рта',
    description: `
У Уст воздух густой от невысказанных исповедей.

Машина и Синод спорят здесь без слов — в вибрации камня. Тебе остаётся **третья строка**: не молитва, не метка, а формула, которую ты вывел на стене и у телеги, и в шестерне.

Если произнести её неверно — земля примет как шутку. Если верно — акт I закроется, как крышка гроба.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Произнести формулу вслух',
        effects: { corruption: 8, sanity: -6, addFlag: 'heretic_act1_formula' },
      },
      {
        id: 'jump_pit',
        text: 'Шепнуть формулу в трещину',
        effects: { corruption: 10, sanity: -8, addFlag: 'heretic_act1_formula' },
      },
    ],
  },
}
