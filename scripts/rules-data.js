/*
 * Genesys Dice Helper
 *
 * These are concise, paraphrased reference summaries derived from:
 * - Genesys Core Rulebook (GCRB)
 * - Realms of Terrinoth (RoT)
 *
 * They intentionally do not reproduce the sourcebook tables verbatim.
 */

export const SOURCES = Object.freeze({
  generic: "GCRB pp. 23–24",
  maneuver: "GCRB p. 98",
  combat: "GCRB pp. 103–104",
  medicine: "GCRB p. 61",
  social: "GCRB pp. 121–123",
  magic: "GCRB pp. 210–211",
  crafting: "RoT p. 113",
  alchemy: "RoT p. 114"
});

const A = "advantage";
const T = "triumph";
const H = "threat";
const D = "despair";

function spend(symbol, cost, text, source, options = {}) {
  return Object.freeze({
    symbol,
    cost,
    text,
    source,
    altTriumph: Boolean(options.altTriumph),
    altDespair: Boolean(options.altDespair),
    repeatable: Boolean(options.repeatable),
    condition: options.condition ?? ""
  });
}

export const COMBAT_SPENDS = Object.freeze([
  spend(A, 1, "Відновити 1 Strain.", SOURCES.combat, { altTriumph: true, repeatable: true }),
  spend(A, 1, "Додати Boost до наступної перевірки наступного союзного активного персонажа.", SOURCES.combat, { altTriumph: true }),
  spend(A, 1, "Помітити важливу деталь у поточному конфлікті.", SOURCES.combat, { altTriumph: true }),
  spend(A, 1, "Активувати Critical Injury або item quality; фактична вартість Advantage залежить від Critical Rating чи властивості.", SOURCES.combat, {
    altTriumph: true,
    condition: "Critical Injury потребує успішної атаки, яка завдала Wounds після Soak."
  }),

  spend(A, 2, "Негайно виконати безкоштовний Maneuver, не перевищуючи ліміт у два Maneuvers за хід.", SOURCES.combat, { altTriumph: true }),
  spend(A, 2, "Додати Setback до наступної перевірки цілі.", SOURCES.combat, { altTriumph: true }),
  spend(A, 2, "Додати Boost до наступної перевірки будь-якого союзника, включно з активним персонажем.", SOURCES.combat, { altTriumph: true }),

  spend(A, 3, "Ігнорувати Defense цілі до кінця поточного раунду.", SOURCES.combat, { altTriumph: true }),
  spend(A, 3, "Ігнорувати штрафні ефекти середовища до кінця наступного ходу активного персонажа.", SOURCES.combat, { altTriumph: true }),
  spend(A, 3, "Замість Wounds/Strain тимчасово вивести з ладу ціль або один предмет її спорядження, за погодженням із GM.", SOURCES.combat, { altTriumph: true }),
  spend(A, 3, "Отримати +1 Melee Defense або Ranged Defense до кінця наступного ходу активного персонажа.", SOURCES.combat, { altTriumph: true }),
  spend(A, 3, "Змусити ціль упустити зброю, яку вона тримає.", SOURCES.combat, { altTriumph: true }),

  spend(T, 1, "Upgrade difficulty наступної перевірки цілі.", SOURCES.combat),
  spend(T, 1, "Upgrade ability наступної перевірки будь-якого союзника, включно з активним персонажем.", SOURCES.combat),
  spend(T, 1, "Створити важливу вирішальну перевагу в сцені, якщо GM погоджується.", SOURCES.combat),
  spend(T, 1, "На Initiative check виконати безкоштовний Maneuver до початку бою.", SOURCES.combat),
  spend(T, 2, "Під час атаки знищити предмет спорядження, яким користується ціль.", SOURCES.combat),

  spend(H, 1, "Активний персонаж отримує 1 Strain.", SOURCES.combat, { altDespair: true, repeatable: true }),
  spend(H, 1, "Втратити користь від раніше виконаного Maneuver, доки персонаж не виконає його знову.", SOURCES.combat, { altDespair: true }),

  spend(H, 2, "Один противник негайно виконує безкоштовний Maneuver як Incidental.", SOURCES.combat, { altDespair: true }),
  spend(H, 2, "Додати Boost до наступної перевірки цілі.", SOURCES.combat, { altDespair: true }),
  spend(H, 2, "Додати Setback до наступної Action активного персонажа або союзника.", SOURCES.combat, { altDespair: true }),

  spend(H, 3, "Активний персонаж падає Prone.", SOURCES.combat, { altDespair: true }),
  spend(H, 3, "Противник отримує значну ситуативну перевагу в поточному конфлікті.", SOURCES.combat, { altDespair: true }),

  spend(D, 1, "Ranged weapon негайно вичерпує боєприпаси й не може використовуватися до кінця encounter.", SOURCES.combat),
  spend(D, 1, "Upgrade difficulty наступної перевірки союзника або активного персонажа.", SOURCES.combat),
  spend(D, 1, "Інструмент, Brawl weapon або Melee weapon активного персонажа пошкоджується.", SOURCES.combat)
]);

export const SOCIAL_SPENDS = Object.freeze([
  spend(A, 1, "Відновити 1 Strain.", SOURCES.social, { altTriumph: true, repeatable: true }),
  spend(A, 1, "Додати Boost до наступної перевірки наступного союзного активного персонажа.", SOURCES.social, { altTriumph: true }),
  spend(A, 1, "Помітити одну важливу деталь у поточній соціальній сцені.", SOURCES.social, { altTriumph: true }),

  spend(A, 2, "Дізнатися Strength або Flaw цілі.", SOURCES.social, { altTriumph: true }),
  spend(A, 2, "Додати Setback до наступної перевірки цілі.", SOURCES.social, { altTriumph: true }),
  spend(A, 2, "Додати Boost до наступної перевірки будь-якого союзника, включно з активним персонажем.", SOURCES.social, { altTriumph: true }),

  spend(A, 3, "Дізнатися Desire або Fear цілі.", SOURCES.social, { altTriumph: true }),
  spend(A, 3, "Приховати справжню мету персонажа в encounter.", SOURCES.social, { altTriumph: true }),
  spend(A, 3, "Дізнатися справжню мету цілі, якщо вона її має.", SOURCES.social, { altTriumph: true }),

  spend(T, 1, "Дізнатися один Motivation facet будь-якого персонажа в encounter, з дозволу GM.", SOURCES.social),
  spend(T, 1, "Upgrade difficulty наступної перевірки цілі.", SOURCES.social),
  spend(T, 1, "Upgrade ability наступної перевірки будь-якого союзника, включно з активним персонажем.", SOURCES.social),
  spend(T, 1, "Створити важливу перевагу в соціальній сцені, наприклад відволікти всіх потрібних NPC.", SOURCES.social),
  spend(T, 1, "У структурованому social encounter можна завдати Critical Remark і 5 Strain.", SOURCES.social, {
    condition: "Альтернатива: 4 Advantage."
  }),
  spend(A, 4, "У структурованому social encounter можна завдати Critical Remark і 5 Strain.", SOURCES.social, {
    altTriumph: true
  }),

  spend(H, 1, "Активний персонаж отримує 1 Strain.", SOURCES.social, { altDespair: true, repeatable: true }),
  spend(H, 1, "Персонаж відволікається або збивається з теми; це може завадити використати Maneuver-залежну ability наступного ходу.", SOURCES.social, { altDespair: true }),

  spend(H, 2, "Випадково розкрити власний Strength або Flaw.", SOURCES.social, { altDespair: true }),
  spend(H, 2, "Додати Boost до наступної перевірки цілі.", SOURCES.social, { altDespair: true }),
  spend(H, 2, "Додати Setback до наступної Action активного персонажа або союзника.", SOURCES.social, { altDespair: true }),

  spend(H, 3, "Випадково розкрити власний Desire або Fear.", SOURCES.social, { altDespair: true }),
  spend(H, 3, "Випадково розкрити справжню мету персонажа в encounter.", SOURCES.social, { altDespair: true }),

  spend(D, 1, "Випадково розкрити один Motivation facet союзника.", SOURCES.social),
  spend(D, 1, "Отримати хибне уявлення про один Motivation facet цілі й вважати його правдивим.", SOURCES.social),
  spend(D, 1, "Upgrade difficulty наступної перевірки союзника або активного персонажа.", SOURCES.social),
  spend(D, 1, "Настільки загрузнути в побічних подіях, що персонаж не може зробити нічого важливого наступного раунду.", SOURCES.social)
]);

export const MAGIC_NEGATIVE_SPENDS = Object.freeze([
  spend(H, 1, "Магія виснажує кастера: 2 Strain або 1 Wound, на вибір контролюючого гравця.", SOURCES.magic, { altDespair: true }),
  spend(H, 1, "Кастер і союзні spellcasters додають Setback до spell checks до кінця наступного ходу кастера.", SOURCES.magic, { altDespair: true }),

  spend(H, 2, "Spell спрацьовує лише на початку наступного раунду, або приблизно через хвилину в narrative play.", SOURCES.magic, { altDespair: true }),
  spend(H, 2, "Якщо використовується magic item, він пошкоджується на один стан.", SOURCES.magic, { altDespair: true }),
  spend(H, 2, "До кінця encounter ворожі spellcasters отримують Boost, коли їхній spell targets цього кастера.", SOURCES.magic, { altDespair: true }),

  spend(H, 3, "Spell стає трохи сильнішим, ніж очікувалося, і GM додає ще одну ціль або інший додатковий ефект.", SOURCES.magic, { altDespair: true }),
  spend(H, 3, "Інші magic-sensitive істоти та spellcasters у межах приблизно дня подорожі відчувають цей прояв магії.", SOURCES.magic, { altDespair: true }),

  spend(D, 1, "Кастер втрачає здатність cast spells до кінця encounter або scene.", SOURCES.magic),
  spend(D, 1, "GM визначає ціль spell; якщо caster є NPC, ціль визначає гравець.", SOURCES.magic),
  spend(D, 2, "Катастрофічний magical backlash: Critical Injury або рівнозначне серйозне narrative ускладнення на розсуд GM.", SOURCES.magic),
  spend(D, 2, "Якщо використовується magic item, він повністю знищується.", SOURCES.magic)
]);

export const ALCHEMY_SPENDS = Object.freeze([
  spend(A, 1, "Користувач potion додатково відновлює 1 Strain або 1 Wound.", SOURCES.alchemy, { altTriumph: true }),
  spend(A, 1, "Додати Boost до наступної Alchemy check цього персонажа.", SOURCES.alchemy, { altTriumph: true }),

  spend(A, 2, "Приготувати одну додаткову дозу potion.", SOURCES.alchemy, { altTriumph: true, repeatable: true }),
  spend(A, 2, "Скоротити час приготування potion удвічі.", SOURCES.alchemy, { altTriumph: true }),

  spend(A, 3, "Зберегти достатньо ingredients для ще однієї партії такого potion.", SOURCES.alchemy, { altTriumph: true }),
  spend(A, 3, "Збільшити тривалість ефекту potion на 1 round, якщо це застосовно.", SOURCES.alchemy, { altTriumph: true }),

  spend(T, 1, "Upgrade difficulty checks, що чинять опір poison, один раз.", SOURCES.alchemy, {
    condition: "Poison only."
  }),
  spend(T, 1, "Potion працює сильніше за норму; конкретний бонус визначає GM.", SOURCES.alchemy),
  spend(T, 2, "Додати до potion ефекти іншого potion нижчої Rarity.", SOURCES.alchemy),

  spend(H, 1, "Якщо potion корисний, користувач після його ефекту отримує 2 Strain.", SOURCES.alchemy, { altDespair: true }),
  spend(H, 1, "Potion/poison має сильний запах, що полегшує його виявлення.", SOURCES.alchemy, { altDespair: true }),

  spend(H, 2, "Potion починає діяти приблизно через хвилину або через 1 round у structured time.", SOURCES.alchemy, { altDespair: true }),
  spend(H, 2, "Потрібно докупити ingredients приблизно на половину початкової component cost.", SOURCES.alchemy, { altDespair: true }),

  spend(H, 3, "Якщо potion корисний, користувач після його ефекту отримує 1 Wound.", SOURCES.alchemy, { altDespair: true }),
  spend(H, 3, "Скоротити тривалість potion на 1 round; encounter-long effect стає коротким.", SOURCES.alchemy, { altDespair: true }),

  spend(D, 1, "Користувач potion стає Disoriented на 2 rounds.", SOURCES.alchemy),
  spend(D, 1, "Користувач робить Average Resilience check; при провалі організм відкидає potion і той не спрацьовує.", SOURCES.alchemy),
  spend(D, 2, "Корисний potion після нормального ефекту також спричиняє poison effect.", SOURCES.alchemy)
]);

export const CRAFTING_SPENDS = Object.freeze([
  spend(A, 1, "Скоротити crafting time на 1 день, до мінімуму 1 день.", SOURCES.crafting, { altTriumph: true, repeatable: true }),
  spend(A, 1, "Додати Boost до наступної перевірки тим самим crafting skill.", SOURCES.crafting, { altTriumph: true }),

  spend(A, 2, "Зберегти матеріали так, щоб наступний подібний item коштував приблизно вдвічі менше.", SOURCES.crafting, { altTriumph: true }),
  spend(A, 2, "Зменшити Encumbrance item на 1, до мінімуму 0.", SOURCES.crafting, { altTriumph: true }),
  spend(A, 2, "Для одноразового/Limited Ammo 1 item створити ще один ідентичний item.", SOURCES.crafting, { altTriumph: true, repeatable: true }),

  spend(A, 3, "Збільшити Hard Points item на 1.", SOURCES.crafting, { altTriumph: true }),
  spend(A, 3, "Зменшити difficulty майбутніх checks для crafting цього item на 1, до Simple.", SOURCES.crafting, { altTriumph: true }),
  spend(A, 3, "Надати item quality Superior.", SOURCES.crafting, { altTriumph: true }),

  spend(T, 1, "Збільшити на 1 один числовий benefit/quality rating, крім damage, Critical rating, Soak і Defense.", SOURCES.crafting),
  spend(T, 1, "Покращити narrative benefit item або додати новий narrative effect із дозволу GM.", SOURCES.crafting),
  spend(T, 2, "Надати item одну додаткову item quality з дозволу GM.", SOURCES.crafting),

  spend(H, 1, "Збільшити crafting time на 1 день.", SOURCES.crafting, { altDespair: true, repeatable: true }),
  spend(H, 1, "Додати Setback до наступної crafting check персонажа.", SOURCES.crafting, { altDespair: true }),

  spend(H, 2, "Збільшити Encumbrance item на 1.", SOURCES.crafting, { altDespair: true }),
  spend(H, 2, "Потрібно докупити матеріали приблизно на половину початкової component cost.", SOURCES.crafting, { altDespair: true }),

  spend(H, 3, "Якщо item є weapon, він отримує Inaccurate 1.", SOURCES.crafting, { altDespair: true }),
  spend(H, 3, "Зменшити Hard Points item на 1, до мінімуму 0.", SOURCES.crafting, { altDespair: true }),

  spend(D, 1, "Інструменти псуються і потребують заміни.", SOURCES.crafting),
  spend(D, 1, "Item отримує quality Inferior.", SOURCES.crafting),
  spend(D, 1, "Коли item пошкоджується, він отримує ще один додатковий step damage.", SOURCES.crafting),
  spend(D, 2, "Стається серйозна аварія: Critical Injury або рівнозначна narrative катастрофа, яку визначає GM.", SOURCES.crafting)
]);

export const GENERIC_GUIDANCE = Object.freeze({
  advantage: Object.freeze([
    {
      text: "Створіть позитивний побічний ефект, що відповідає ситуації. Core Rulebook прямо наводить як типові напрямки додатковий Maneuver, відновлення Strain або активацію special effect.",
      source: SOURCES.generic
    },
    {
      text: "У structured encounter 2 Advantage можуть дати другий Maneuver, якщо не перевищено ліміт у два Maneuvers за хід.",
      source: SOURCES.maneuver,
      fixedCost: 2
    }
  ]),
  triumph: Object.freeze([
    {
      text: "Створіть значний неочікуваний boon або інший сильний позитивний побічний ефект. Triumph не гарантує успіх перевірки.",
      source: SOURCES.generic
    }
  ]),
  threat: Object.freeze([
    {
      text: "GM додає негативний побічний ефект або complication. Типові напрямки: Strain, можливість для противника, Prone, environmental complication або більша тривалість завдання.",
      source: SOURCES.generic
    }
  ]),
  despair: Object.freeze([
    {
      text: "GM додає серйозний негативний наслідок. Core Rulebook наводить як орієнтири Wounds замість Strain, поломку важливого gear або проблему зі зброєю/боєприпасами.",
      source: SOURCES.generic
    }
  ])
});

export const MEDICINE_AUTOMATIC = Object.freeze([
  {
    text: "Успішна Medicine check для лікування Wounds відновлює Wounds за кількістю uncanceled Success.",
    source: SOURCES.medicine
  },
  {
    text: "Та сама Medicine check відновлює Strain за кількістю uncanceled Advantage.",
    source: SOURCES.medicine
  }
]);

export function normalizeSkillName(value) {
  return String(value ?? "")
    .toLocaleLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[()[\]{}:;,./\\_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const ALIASES = Object.freeze({
  medicine: new Set(["medicine", "медицина"].map(normalizeSkillName)),
  alchemy: new Set(["alchemy", "алхімія"].map(normalizeSkillName)),
  mechanics: new Set(["mechanics", "ремесло"].map(normalizeSkillName))
});

export function specialSkillKind(skillName) {
  const normalized = normalizeSkillName(skillName);

  for (const [kind, aliases] of Object.entries(ALIASES)) {
    if (aliases.has(normalized)) return kind;
  }

  return null;
}
