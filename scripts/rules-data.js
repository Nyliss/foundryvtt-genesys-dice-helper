const L = (en, uk) => Object.freeze({ en, uk });
const A = "advantage";
const T = "triumph";
const H = "threat";
const D = "despair";

function spend(symbol, cost, en, uk, condition = null) {
  return Object.freeze({
    symbol,
    cost,
    text: L(en, uk),
    condition: condition ? L(condition.en, condition.uk) : null
  });
}

export const COMBAT_SPENDS = Object.freeze([
  spend(A,1,"Recover 1 Strain.","Відновити 1 Strain."),
  spend(A,1,"Add a Boost die to the next check made by the next allied active character.","Додати Boost до наступної перевірки наступного союзного активного персонажа."),
  spend(A,1,"Notice an important detail in the current conflict.","Помітити важливу деталь у поточному конфлікті."),
  spend(A,2,"Immediately perform one free Maneuver, without exceeding two Maneuvers this turn.","Негайно виконати безкоштовний Maneuver, не перевищуючи ліміт у два Maneuvers за хід."),
  spend(A,2,"Add a Setback die to the target's next check.","Додати Setback до наступної перевірки цілі."),
  spend(A,2,"Add a Boost die to the next check made by any allied character, including the active character.","Додати Boost до наступної перевірки будь-якого союзника, включно з активним персонажем."),
  spend(A,3,"Ignore the target's Defense until the end of the current round.","Ігнорувати Defense цілі до кінця поточного раунду."),
  spend(A,3,"Ignore environmental penalties until the end of the active character's next turn.","Ігнорувати штрафні ефекти середовища до кінця наступного ходу активного персонажа."),
  spend(A,3,"Instead of inflicting Wounds or Strain, temporarily disable the target or one piece of its gear, with GM approval.","Замість Wounds/Strain тимчасово вивести з ладу ціль або один предмет її спорядження, за погодженням із GM."),
  spend(A,3,"Gain +1 Melee Defense or Ranged Defense until the end of the active character's next turn.","Отримати +1 Melee Defense або Ranged Defense до кінця наступного ходу активного персонажа."),
  spend(A,3,"Force the target to drop a held weapon.","Змусити ціль упустити зброю, яку вона тримає."),
  spend(T,1,"Inflict one Critical Injury regardless of the weapon's Critical Rating.","Завдати 1 Critical Injury незалежно від Critical Rating зброї.",{en:"Requires a successful attack that inflicted Wounds after Soak.",uk:"Потрібна успішна атака, яка завдала Wounds після Soak."}),
  spend(T,1,"Activate one active item quality regardless of its normal Advantage cost.","Активувати одну active item quality незалежно від її звичайної Advantage cost."),
  spend(T,1,"Upgrade the difficulty of the target's next check.","Upgrade difficulty наступної перевірки цілі."),
  spend(T,1,"Upgrade the ability of the next check made by any allied character, including the active character.","Upgrade ability наступної перевірки будь-якого союзника, включно з активним персонажем."),
  spend(T,1,"Create a major decisive advantage in the scene, with GM approval.","Створити важливу вирішальну перевагу в сцені, якщо GM погоджується."),
  spend(T,1,"On an Initiative check, perform one free Maneuver before combat begins.","На Initiative check виконати безкоштовний Maneuver до початку бою."),
  spend(T,2,"During an attack, destroy one piece of equipment used by the target.","Під час атаки знищити предмет спорядження, яким користується ціль."),
  spend(H,1,"The active character suffers 1 Strain.","Активний персонаж отримує 1 Strain."),
  spend(H,1,"Lose the benefit of a previously performed Maneuver until it is performed again.","Втратити користь від раніше виконаного Maneuver, доки персонаж не виконає його знову."),
  spend(H,2,"One opponent immediately performs a free Maneuver as an incidental.","Один противник негайно виконує безкоштовний Maneuver як Incidental."),
  spend(H,2,"Add a Boost die to the target's next check.","Додати Boost до наступної перевірки цілі."),
  spend(H,2,"Add a Setback die to the next Action made by the active character or an ally.","Додати Setback до наступної Action активного персонажа або союзника."),
  spend(H,3,"The active character falls Prone.","Активний персонаж падає Prone."),
  spend(H,3,"An opponent gains a significant situational advantage in the current conflict.","Противник отримує значну ситуативну перевагу в поточному конфлікті."),
  spend(D,1,"A ranged weapon immediately runs out of ammunition and cannot be used for the rest of the encounter.","Ranged weapon негайно вичерпує боєприпаси й не може використовуватися до кінця encounter."),
  spend(D,1,"Upgrade the difficulty of the next check made by an ally or the active character.","Upgrade difficulty наступної перевірки союзника або активного персонажа."),
  spend(D,1,"The active character's tool, Brawl weapon, or Melee weapon is damaged.","Інструмент, Brawl weapon або Melee weapon активного персонажа пошкоджується.")
]);

export const SOCIAL_SPENDS = Object.freeze([
  spend(A,1,"Recover 1 Strain.","Відновити 1 Strain."),
  spend(A,1,"Add a Boost die to the next check made by the next allied active character.","Додати Boost до наступної перевірки наступного союзного активного персонажа."),
  spend(A,1,"Notice an important detail in the current social scene.","Помітити одну важливу деталь у поточній соціальній сцені."),
  spend(A,2,"Learn the target's Strength or Flaw.","Дізнатися Strength або Flaw цілі."),
  spend(A,2,"Add a Setback die to the target's next check.","Додати Setback до наступної перевірки цілі."),
  spend(A,2,"Add a Boost die to the next check made by any allied character, including the active character.","Додати Boost до наступної перевірки будь-якого союзника, включно з активним персонажем."),
  spend(A,3,"Learn the target's Desire or Fear.","Дізнатися Desire або Fear цілі."),
  spend(A,3,"Hide the character's true goal during the encounter.","Приховати справжню мету персонажа в encounter."),
  spend(A,3,"Learn the target's true goal, if one exists.","Дізнатися справжню мету цілі, якщо вона її має."),
  spend(A,4,"In a structured social encounter, inflict a Critical Remark and 5 Strain.","У структурованому social encounter завдати Critical Remark і 5 Strain."),
  spend(T,1,"Learn one Motivation facet of any character in the encounter, with GM approval.","Дізнатися один Motivation facet будь-якого персонажа в encounter, з дозволу GM."),
  spend(T,1,"Upgrade the difficulty of the target's next check.","Upgrade difficulty наступної перевірки цілі."),
  spend(T,1,"Upgrade the ability of the next check made by any allied character, including the active character.","Upgrade ability наступної перевірки будь-якого союзника, включно з активним персонажем."),
  spend(T,1,"Create a major advantage in the social scene.","Створити важливу перевагу в соціальній сцені."),
  spend(T,1,"In a structured social encounter, inflict a Critical Remark and 5 Strain.","У структурованому social encounter завдати Critical Remark і 5 Strain."),
  spend(H,1,"The active character suffers 1 Strain.","Активний персонаж отримує 1 Strain."),
  spend(H,1,"The character becomes distracted or loses the thread of the conversation.","Персонаж відволікається або збивається з теми."),
  spend(H,2,"Accidentally reveal the character's own Strength or Flaw.","Випадково розкрити власний Strength або Flaw."),
  spend(H,2,"Add a Boost die to the target's next check.","Додати Boost до наступної перевірки цілі."),
  spend(H,2,"Add a Setback die to the next Action made by the active character or an ally.","Додати Setback до наступної Action активного персонажа або союзника."),
  spend(H,3,"Accidentally reveal the character's own Desire or Fear.","Випадково розкрити власний Desire або Fear."),
  spend(H,3,"Accidentally reveal the character's true goal in the encounter.","Випадково розкрити справжню мету персонажа в encounter."),
  spend(D,1,"Accidentally reveal one Motivation facet of an ally.","Випадково розкрити один Motivation facet союзника."),
  spend(D,1,"Gain a false impression of one Motivation facet of the target and believe it to be true.","Отримати хибне уявлення про один Motivation facet цілі й вважати його правдивим."),
  spend(D,1,"Upgrade the difficulty of the next check made by an ally or the active character.","Upgrade difficulty наступної перевірки союзника або активного персонажа."),
  spend(D,1,"Become so entangled in side issues that the character cannot accomplish anything important next round.","Настільки загрузнути в побічних подіях, що персонаж не може зробити нічого важливого наступного раунду.")
]);

export const MAGIC_SPENDS = Object.freeze([
  spend(H,1,"The magic exhausts the caster: suffer 2 Strain or 1 Wound, chosen by the controlling player.","Магія виснажує кастера: 2 Strain або 1 Wound, на вибір контролюючого гравця."),
  spend(H,1,"The caster and allied spellcasters add a Setback die to spell checks until the end of the caster's next turn.","Кастер і союзні spellcasters додають Setback до spell checks до кінця наступного ходу кастера."),
  spend(H,2,"The spell does not take effect until the start of the next round, or about a minute later in narrative time.","Spell спрацьовує лише на початку наступного раунду, або приблизно через хвилину в narrative play."),
  spend(H,2,"If a magic item is being used, it becomes damaged by one step.","Якщо використовується magic item, він пошкоджується на один стан."),
  spend(H,2,"Until the end of the encounter, hostile spellcasters gain a Boost die when their spells target this caster.","До кінця encounter ворожі spellcasters отримують Boost, коли їхній spell targets цього кастера."),
  spend(H,3,"The spell becomes stronger or broader than intended; the GM adds another target or comparable effect.","Spell стає сильнішим або ширшим, ніж очікувалося; GM додає ще одну ціль або співмірний ефект."),
  spend(H,3,"Other magic-sensitive creatures and spellcasters within roughly a day's travel sense this use of magic.","Інші magic-sensitive істоти та spellcasters у межах приблизно дня подорожі відчувають цей прояв магії."),
  spend(D,1,"The caster cannot cast spells for the rest of the encounter or scene.","Кастер втрачає здатність cast spells до кінця encounter або scene."),
  spend(D,1,"The GM determines the spell's target; if the caster is an NPC, a player determines it.","GM визначає ціль spell; якщо caster є NPC, ціль визначає гравець."),
  spend(D,2,"Catastrophic magical backlash: a Critical Injury or a similarly serious narrative consequence chosen by the GM.","Катастрофічний magical backlash: Critical Injury або рівнозначне серйозне narrative ускладнення на розсуд GM."),
  spend(D,2,"If a magic item is being used, it is destroyed.","Якщо використовується magic item, він повністю знищується.")
]);

export const ALCHEMY_SPENDS = Object.freeze([
  spend(A,1,"The potion's user also recovers 1 Strain or 1 Wound.","Користувач potion додатково відновлює 1 Strain або 1 Wound."),
  spend(A,1,"Add a Boost die to this character's next Alchemy check.","Додати Boost до наступної Alchemy check цього персонажа."),
  spend(A,2,"Create one additional dose of the potion.","Приготувати одну додаткову дозу potion."),
  spend(A,2,"Halve the potion's preparation time.","Скоротити час приготування potion удвічі."),
  spend(A,3,"Save enough ingredients for another batch of the same potion.","Зберегти достатньо ingredients для ще однієї партії такого potion."),
  spend(A,3,"Increase the potion's duration by 1 round, where applicable.","Збільшити тривалість ефекту potion на 1 round, якщо це застосовно."),
  spend(T,1,"Upgrade the difficulty of checks made to resist the poison once.","Upgrade difficulty checks, що чинять опір poison, один раз.",{en:"Poison only.",uk:"Лише poison."}),
  spend(T,1,"The potion works more strongly than normal; the GM determines the exact bonus.","Potion працює сильніше за норму; конкретний бонус визначає GM."),
  spend(T,2,"Add the effects of another potion of lower Rarity.","Додати до potion ефекти іншого potion нижчої Rarity."),
  spend(H,1,"If the potion is beneficial, its user suffers 2 Strain after the effect resolves.","Якщо potion корисний, користувач після його ефекту отримує 2 Strain."),
  spend(H,1,"The potion or poison has a strong odor that makes it easier to detect.","Potion/poison має сильний запах, що полегшує його виявлення."),
  spend(H,2,"The potion begins working about a minute later, or 1 round later in structured time.","Potion починає діяти приблизно через хвилину або через 1 round у structured time."),
  spend(H,2,"Additional ingredients worth about half the original component cost are required.","Потрібно докупити ingredients приблизно на половину початкової component cost."),
  spend(H,3,"If the potion is beneficial, its user suffers 1 Wound after the effect resolves.","Якщо potion корисний, користувач після його ефекту отримує 1 Wound."),
  spend(H,3,"Reduce the potion's duration by 1 round; an encounter-long effect becomes brief.","Скоротити тривалість potion на 1 round; encounter-long effect стає коротким."),
  spend(D,1,"The potion's user becomes Disoriented for 2 rounds.","Користувач potion стає Disoriented на 2 rounds."),
  spend(D,1,"The user makes an Average Resilience check; on a failure, the body rejects the potion and it has no effect.","Користувач робить Average Resilience check; при провалі організм відкидає potion і той не спрацьовує."),
  spend(D,2,"A beneficial potion also causes a poison effect after its normal effect.","Корисний potion після нормального ефекту також спричиняє poison effect.")
]);

export const CRAFTING_SPENDS = Object.freeze([
  spend(A,1,"Reduce crafting time by 1 day, to a minimum of 1 day.","Скоротити crafting time на 1 день, до мінімуму 1 день."),
  spend(A,1,"Add a Boost die to the next check using the same crafting skill.","Додати Boost до наступної перевірки тим самим crafting skill."),
  spend(A,2,"Save enough materials that the next similar item costs about half as much to make.","Зберегти матеріали так, щоб наступний подібний item коштував приблизно вдвічі менше."),
  spend(A,2,"Reduce the item's Encumbrance by 1, to a minimum of 0.","Зменшити Encumbrance item на 1, до мінімуму 0."),
  spend(A,2,"For a single-use or Limited Ammo 1 item, create one additional identical item.","Для одноразового/Limited Ammo 1 item створити ще один ідентичний item."),
  spend(A,3,"Increase the item's Hard Points by 1.","Збільшити Hard Points item на 1."),
  spend(A,3,"Reduce the difficulty of future checks to craft this item by one, to a minimum of Simple.","Зменшити difficulty майбутніх checks для crafting цього item на 1, до Simple."),
  spend(A,3,"Give the item the Superior quality.","Надати item quality Superior."),
  spend(T,1,"Increase one numerical benefit or quality rating by 1, excluding damage, Critical rating, Soak, and Defense.","Збільшити на 1 один числовий benefit/quality rating, крім damage, Critical rating, Soak і Defense."),
  spend(T,1,"Improve a narrative benefit or add a new narrative effect with GM approval.","Покращити narrative benefit item або додати новий narrative effect із дозволу GM."),
  spend(T,2,"Give the item one additional item quality with GM approval.","Надати item одну додаткову item quality з дозволу GM."),
  spend(H,1,"Increase crafting time by 1 day.","Збільшити crafting time на 1 день."),
  spend(H,1,"Add a Setback die to the character's next crafting check.","Додати Setback до наступної crafting check персонажа."),
  spend(H,2,"Increase the item's Encumbrance by 1.","Збільшити Encumbrance item на 1."),
  spend(H,2,"Additional materials worth about half the original component cost are required.","Потрібно докупити матеріали приблизно на половину початкової component cost."),
  spend(H,3,"If the item is a weapon, it gains Inaccurate 1.","Якщо item є weapon, він отримує Inaccurate 1."),
  spend(H,3,"Reduce the item's Hard Points by 1, to a minimum of 0.","Зменшити Hard Points item на 1, до мінімуму 0."),
  spend(D,1,"The tools are ruined and need replacement.","Інструменти псуються і потребують заміни."),
  spend(D,1,"The item gains the Inferior quality.","Item отримує quality Inferior."),
  spend(D,1,"Whenever the item is damaged, it suffers one additional step of damage.","Коли item пошкоджується, він отримує ще один додатковий step damage."),
  spend(D,2,"A serious accident occurs: a Critical Injury or comparable narrative catastrophe chosen by the GM.","Стається серйозна аварія: Critical Injury або рівнозначна narrative катастрофа, яку визначає GM.")
]);

export const GENERIC_GUIDANCE = Object.freeze({
  advantage: [
    { cost:1, text:L("Create a positive side effect appropriate to the situation, such as recovering Strain, noticing something useful, or creating an opening.","Створіть позитивний побічний ефект, що відповідає ситуації: відновлення Strain, корисна деталь або нова можливість.") },
    { cost:2, text:L("In a structured encounter, gain a second Maneuver if the two-Maneuver-per-turn limit is not exceeded.","У structured encounter отримати другий Maneuver, якщо не перевищено ліміт у два Maneuvers за хід.") }
  ],
  triumph: [
    { cost:1, text:L("Create a major unexpected boon or similarly powerful positive side effect. Triumph does not turn a failed check into a success by itself.","Створіть значний неочікуваний boon або інший сильний позитивний побічний ефект. Triumph сам по собі не робить провалену перевірку успішною.") }
  ],
  threat: [
    { cost:1, text:L("Add a negative side effect or complication appropriate to the scene, such as Strain, lost time, poor position, or an opening for an opponent.","Додайте негативний побічний ефект або complication: Strain, втрату часу, погану позицію чи можливість для противника.") }
  ],
  despair: [
    { cost:1, text:L("Add a serious negative consequence, such as damaged important gear, a dangerous escalation, or another major complication.","Додайте серйозний негативний наслідок: поломку важливого gear, небезпечну ескалацію або інше значне ускладнення.") }
  ]
});

export const MEDICINE_AUTOMATIC = Object.freeze([
  { text:L("A successful Medicine check to treat Wounds restores Wounds equal to uncanceled Success.","Успішна Medicine check для лікування Wounds відновлює Wounds за кількістю uncanceled Success.") },
  { text:L("The same Medicine check restores Strain equal to uncanceled Advantage.","Та сама Medicine check відновлює Strain за кількістю uncanceled Advantage.") }
]);

export function normalizeSkillName(value) {
  return String(value ?? "")
    .toLocaleLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[()[\]{}:;,./\\_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function specialSkillKind(skill) {
  const n = normalizeSkillName(skill?.name ?? skill ?? "");
  if (["medicine","медицина"].includes(n)) return "medicine";
  if (["alchemy","алхімія"].includes(n)) return "alchemy";
  if (["mechanics","ремесло"].includes(n)) return "mechanics";
  return null;
}
