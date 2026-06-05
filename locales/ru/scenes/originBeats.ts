import type { Scene } from '@/lib/types/game'

export const originBeatScenes: Record<string, Scene> = {
  beat_witness_bell: {
    id: 'beat_witness_bell',
    title: 'Память Колокола',
    description: `
Осколок на груди дрожит — не от холода.

Ты снова стоишь на дороге в ту ночь: восковые маски, коленопреклонённые спины, последний удар колокола — и тишина, которая не была тишиной.

Паломники ушли в трещину. Ты остался смотреть. Мир **запомнил** твой взгляд.

Шествие не закончилось — оно просто продолжилось без тебя в хвосте.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Спуститься — наверстать то, что пропустил',
        effects: { sanity: -8, corruption: 3 },
      },
      {
        id: 'monastery',
        text: 'Искать ответ в пустом монастыре',
        effects: { sanity: -4 },
      },
    ],
  },

  beat_heretic_whisper: {
    id: 'beat_heretic_whisper',
    title: 'Голос под Камнем',
    description: `
Трещина в дороге дышит тёплым воздухом — тем же, что ты слышал под собором.

Голос не божественный. Он **деловой**: «Ты уже знаешь цену ответа. Спускайся — или читай дальше без меня.»

Пепел на губах вкусит как пепел исповеди, которую ты никогда не произносил вслух.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Спуститься к Устам',
        effects: { corruption: 5, sanity: -4 },
      },
      {
        id: 'jump_pit',
        text: 'Ответить шёпотом в трещину',
        effects: { corruption: 8, sanity: -6, addFlag: 'heretic_answered' },
      },
    ],
  },

  beat_hollow_mask: {
    id: 'beat_hollow_mask',
    title: 'Лицо без Имени',
    description: `
Ты поднимаешь маску — не чтобы надеть, а чтобы **проверить**, осталось ли под ней что-то твоё.

В отражении на железе пустота смотрит спокойно. Не угрожает. **Ждёт.**

Голод под доспехами стихает на миг, будто маска и тело наконец договорились, кто из них главнее.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Спуститься с маской на поясе',
        effects: { corruption: 3, sanity: -3 },
      },
      {
        id: 'monastery',
        text: 'Искать тишину в монастыре',
        effects: { sanity: 2, corruption: 1 },
      },
      {
        id: 'merchant',
        text: 'Вернуться к Бездыханному',
        effects: { sanity: -1 },
      },
    ],
  },
}
