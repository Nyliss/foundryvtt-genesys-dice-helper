import { MODULE_ID } from "./i18n.js";
import { installDiceHelper } from "./dice-helper.js";
import {
  ensureCriticalCompendium,
  ensureCriticalMacro,
  openCriticalInjury,
  openCriticalCompendium,
  rollCriticalInjury,
  getCriticalCompendium
} from "./critical-injuries.js";

const VERSION = "1.1.1";
const TESTED_FOUNDRY = "13.351";
const TESTED_SYSTEM = "0.2.19";

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "language", {
    name: "Module Language / Мова модуля",
    hint: "Automatic follows the Foundry client language. English and Українська override the Toolkit language for this client.",
    scope: "client",
    config: true,
    type: String,
    choices: {
      auto: "Automatic / Автоматично",
      en: "English",
      uk: "Українська"
    },
    default: "auto"
  });

  game.settings.register(MODULE_ID, "useActiveSkillsCompendium", {
    name: "Use Active Genesys Skills Compendium / Використовувати активний Genesys Skills Compendium",
    hint: "Uses the Skills Compendium selected in Genesys system settings (CONFIG.genesys.skills).",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    restricted: true
  });

  game.settings.register(MODULE_ID, "enableDiceHelper", {
    name: "Enable Dice Helper / Увімкнути Dice Helper",
    hint: "Adds Help Spending Results to Genesys rolls in chat.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    restricted: true
  });

  game.settings.register(MODULE_ID, "includeTerrinoth", {
    name: "Include Realms of Terrinoth Results / Додати результати Realms of Terrinoth",
    hint: "Adds Alchemy and crafting result guidance.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    restricted: true
  });

  game.settings.register(MODULE_ID, "showGenericGuidance", {
    name: "Show General Narrative Guidance / Показувати загальні наративні підказки",
    hint: "Shows Core Rulebook guidance for skills without a dedicated spending table.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "expandDiceHelper", {
    name: "Expand Dice Helper Automatically / Автоматично розгортати Dice Helper",
    hint: "Opens Help Spending Results automatically on new rolls.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "enableCriticalInjuries", {
    name: "Enable Critical Injury Tools / Увімкнути Critical Injury Tools",
    hint: "Enables the roller, managed compendium, managed macro, and Dice Helper integration.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    restricted: true
  });

  game.settings.register(MODULE_ID, "criticalCompendiumLanguage", {
    name: "Critical Injury Compendium Language / Мова компендіуму Critical Injuries",
    hint: "World setting: all users share the same Critical Injury compendium language.",
    scope: "world",
    config: true,
    type: String,
    choices: { en: "English", uk: "Українська" },
    default: "en",
    restricted: true,
    onChange: async () => {
      if (game.user?.isGM) await ensureCriticalCompendium({ notify: true });
    }
  });

  game.settings.register(MODULE_ID, "syncCriticalCompendium", {
    name: "Sync Critical Injury Compendium / Синхронізувати компендіум Critical Injuries",
    hint: "Creates and maintains a world Item compendium containing the Core Critical Injuries.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    restricted: true,
    onChange: async value => {
      if (value && game.user?.isGM) await ensureCriticalCompendium({ notify: true });
    }
  });

  game.settings.register(MODULE_ID, "createCriticalMacro", {
    name: "Create Critical Injury Macro / Створювати макрос Critical Injury",
    hint: "Creates and maintains a shared world macro that opens the Critical Injury roller.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    restricted: true,
    onChange: async value => {
      if (value && game.user?.isGM) await ensureCriticalMacro({ notify: true });
    }
  });

  game.settings.register(MODULE_ID, "criticalAutoApply", {
    name: "Apply Critical Injury by Default / За замовчуванням додавати Injury до Actor",
    hint: "The Critical Injury roller starts with Add Injury to Actor checked.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  installDiceHelper();
});

Hooks.once("ready", async () => {
  if (game.system?.id !== "genesys") {
    ui.notifications.error("Genesys Toolkit can only be used with the Genesys system.");
    return;
  }

  const generation = Number(game.release?.generation ?? 0);
  if (generation !== 13) {
    ui.notifications.warn(`Genesys Toolkit v${VERSION} is built for Foundry VTT 13 and tested on ${TESTED_FOUNDRY}. Current: ${game.version ?? game.release?.version ?? "unknown"}.`);
  }

  if (game.system?.version !== TESTED_SYSTEM) {
    ui.notifications.warn(`Genesys Toolkit v${VERSION} is tested with Genesys ${TESTED_SYSTEM}. Current: ${game.system?.version ?? "unknown"}.`);
  }

  const mod = game.modules.get(MODULE_ID);
  if (mod) {
    mod.api = {
      version: VERSION,
      openCriticalInjury,
      openCriticalCompendium,
      rollCriticalInjury,
      syncCriticalCompendium: () => ensureCriticalCompendium({ notify: true }),
      getCriticalCompendium,
      getActiveSkills: () => Array.isArray(CONFIG.genesys?.skills) ? CONFIG.genesys.skills : [],
      getActiveSkillsCompendium: () => CONFIG.genesys?.settings?.skillsCompendium ?? null
    };
  }

  if (game.user?.isGM && game.settings.get(MODULE_ID, "enableCriticalInjuries")) {
    await ensureCriticalCompendium();
    await ensureCriticalMacro();
  }

  console.log(`Genesys Toolkit | v${VERSION} ready | Foundry ${game.version} | Genesys ${game.system.version} | Skills Compendium: ${CONFIG.genesys?.settings?.skillsCompendium ?? "unknown"}`);
});
