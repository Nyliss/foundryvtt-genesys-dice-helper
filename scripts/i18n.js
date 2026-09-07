export const MODULE_ID = "genesys-dice-helper";

const STRINGS = {
  en: {
    "dice.button": "Help Spending Results",
    "dice.title": "Spending Results",
    "dice.unknownSkill": "Skill not detected",
    "dice.noSkill": "The skill could not be identified from the Actor or the active Genesys Skills Compendium.",
    "dice.combat": "Combat",
    "dice.combatSub": "Core combat result options",
    "dice.social": "Social Encounter",
    "dice.socialSub": "Structured social encounter options",
    "dice.magic": "Magic Risk",
    "dice.magicSub": "Threat / Despair consequences for magic checks",
    "dice.alchemy": "Alchemy",
    "dice.alchemySub": "Realms of Terrinoth potion-preparation results",
    "dice.crafting": "Crafting Only",
    "dice.craftingSub": "Use only when this Mechanics/crafting check is actually a crafting check.",
    "dice.medicine": "Medicine",
    "dice.medicineSub": "Automatic resolution from the Medicine rules",
    "dice.generic": "General Narrative Guidance",
    "dice.genericSub": "For checks without a dedicated spending table",
    "dice.noOptions": "No book-defined option applies to the remaining symbols.",
    "dice.weaponCritical": "Weapon Critical",
    "dice.weaponQualities": "Weapon qualities",
    "dice.rollCritical": "Roll Critical Injury",

    "critical.title": "Critical Injury",
    "critical.actor": "Target Actor",
    "critical.existing": "Existing Critical Injuries",
    "critical.existingHelp": "+10 per current Critical Injury.",
    "critical.vicious": "Vicious",
    "critical.viciousHelp": "+10 per Vicious rank.",
    "critical.extra": "Additional Critical activations",
    "critical.extraHelp": "+10 for each additional activation beyond the first.",
    "critical.other": "Other modifier",
    "critical.otherHelp": "Positive or negative modifier from talents, abilities, or circumstances.",
    "critical.total": "Total modifier",
    "critical.apply": "Add Injury to Actor",
    "critical.roll": "Roll Critical Injury",
    "critical.openCompendium": "Open Compendium",
    "critical.close": "Close",
    "critical.noActor": "Select or target a non-vehicle, non-minion Actor first.",
    "critical.noPermission": "You do not have permission to add an Injury to this Actor.",
    "critical.noCompendium": "The Critical Injuries compendium is not available.",
    "critical.result": "Critical Injury Result",
    "critical.base": "d100",
    "critical.final": "Final Result",
    "critical.severity": "Severity",
    "critical.characteristic": "Affected Characteristic",
    "critical.applied": "Added to",
    "critical.notApplied": "The Injury was not added to an Actor.",
    "critical.current": "Current Injuries",
    "critical.healingSkill": "Healing Skill",
    "critical.range": "Range",
    "critical.effect": "Effect",
    "critical.compSynced": "Genesys Toolkit synchronized the Critical Injuries compendium.",
    "critical.macroCreated": "Genesys Toolkit created the Critical Injury macro.",

    "severity.easy": "Easy",
    "severity.average": "Average",
    "severity.hard": "Hard",
    "severity.daunting": "Daunting",
    "severity.formidable": "Formidable",
    "severity.-": "—",

    "char.brawn": "Brawn",
    "char.agility": "Agility",
    "char.intellect": "Intellect",
    "char.cunning": "Cunning",
    "char.presence": "Presence",
    "char.willpower": "Willpower",

    "macro.name": "Genesys Toolkit: Critical Injury"
  },

  uk: {
    "dice.button": "Help Spending Results",
    "dice.title": "Spending Results",
    "dice.unknownSkill": "Навичку не визначено",
    "dice.noSkill": "Навичку не вдалося визначити через Actor або активний Genesys Skills Compendium.",
    "dice.combat": "Бій",
    "dice.combatSub": "Варіанти витрат результатів у бою",
    "dice.social": "Соціальна взаємодія",
    "dice.socialSub": "Варіанти для структурованої соціальної сцени",
    "dice.magic": "Ризики магії",
    "dice.magicSub": "Наслідки Threat / Despair для магічних перевірок",
    "dice.alchemy": "Алхімія",
    "dice.alchemySub": "Результати приготування зілля з Realms of Terrinoth",
    "dice.crafting": "Лише крафтинг",
    "dice.craftingSub": "Використовуй лише тоді, коли ця перевірка Ремесла/Mechanics справді є крафтингом.",
    "dice.medicine": "Медицина",
    "dice.medicineSub": "Автоматичне трактування за правилами Medicine",
    "dice.generic": "Загальні наративні підказки",
    "dice.genericSub": "Для перевірок без окремої таблиці витрат",
    "dice.noOptions": "Для цих символів немає окремого книжкового варіанта.",
    "dice.weaponCritical": "Critical зброї",
    "dice.weaponQualities": "Якості зброї",
    "dice.rollCritical": "Кинути Critical Injury",

    "critical.title": "Critical Injury",
    "critical.actor": "Цільовий Actor",
    "critical.existing": "Поточні Critical Injuries",
    "critical.existingHelp": "+10 за кожну поточну Critical Injury.",
    "critical.vicious": "Vicious",
    "critical.viciousHelp": "+10 за кожен ранг Vicious.",
    "critical.extra": "Додаткові активації Critical",
    "critical.extraHelp": "+10 за кожну додаткову активацію після першої.",
    "critical.other": "Інший модифікатор",
    "critical.otherHelp": "Додатний або від’ємний модифікатор від талантів, здібностей чи обставин.",
    "critical.total": "Загальний модифікатор",
    "critical.apply": "Додати Injury до Actor",
    "critical.roll": "Кинути Critical Injury",
    "critical.openCompendium": "Відкрити компендіум",
    "critical.close": "Закрити",
    "critical.noActor": "Спершу обери або візьми в target Actor, який не є vehicle чи minion.",
    "critical.noPermission": "У тебе немає прав додати Injury цьому Actor.",
    "critical.noCompendium": "Компендіум Critical Injuries недоступний.",
    "critical.result": "Результат Critical Injury",
    "critical.base": "d100",
    "critical.final": "Фінальний результат",
    "critical.severity": "Складність лікування",
    "critical.characteristic": "Уражена характеристика",
    "critical.applied": "Додано до",
    "critical.notApplied": "Injury не було додано до Actor.",
    "critical.current": "Поточні травми",
    "critical.healingSkill": "Навичка лікування",
    "critical.range": "Діапазон",
    "critical.effect": "Ефект",
    "critical.compSynced": "Genesys Toolkit синхронізував компендіум Critical Injuries.",
    "critical.macroCreated": "Genesys Toolkit створив макрос Critical Injury.",

    "severity.easy": "Easy",
    "severity.average": "Average",
    "severity.hard": "Hard",
    "severity.daunting": "Daunting",
    "severity.formidable": "Formidable",
    "severity.-": "—",

    "char.brawn": "Brawn",
    "char.agility": "Agility",
    "char.intellect": "Intellect",
    "char.cunning": "Cunning",
    "char.presence": "Presence",
    "char.willpower": "Willpower",

    "macro.name": "Genesys Toolkit: Critical Injury"
  }
};

export function language() {
  let selected = "auto";
  try {
    selected = game.settings.get(MODULE_ID, "language");
  } catch (_error) {}

  if (selected === "uk" || selected === "en") return selected;
  return String(game.i18n?.lang ?? "en").toLowerCase().startsWith("uk") ? "uk" : "en";
}

export function t(key) {
  const lang = language();
  return STRINGS[lang]?.[key] ?? STRINGS.en?.[key] ?? key;
}

export function bilingual(value) {
  if (typeof value === "string") return value;
  const lang = language();
  return value?.[lang] ?? value?.en ?? value?.uk ?? "";
}

export function compendiumLanguage() {
  try {
    return game.settings.get(MODULE_ID, "criticalCompendiumLanguage") === "uk" ? "uk" : "en";
  } catch (_error) {
    return "en";
  }
}
