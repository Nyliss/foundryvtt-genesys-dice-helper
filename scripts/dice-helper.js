import { MODULE_ID, t, bilingual } from "./i18n.js";
import {
  COMBAT_SPENDS,
  SOCIAL_SPENDS,
  MAGIC_SPENDS,
  ALCHEMY_SPENDS,
  CRAFTING_SPENDS,
  GENERIC_GUIDANCE,
  MEDICINE_AUTOMATIC,
  normalizeSkillName,
  specialSkillKind
} from "./rules-data.js";
import { openCriticalInjury } from "./critical-injuries.js";

export function installDiceHelper() {
  Hooks.on("renderChatMessageHTML", (message, html) => {
    if (!game.settings.get(MODULE_ID, "enableDiceHelper")) return;
    if (!(html instanceof HTMLElement)) return;

    const rollCard = html.querySelector(".roll.roll-skill");
    if (!rollCard || rollCard.querySelector("[data-gdh-toggle]")) return;

    const results = readResults(rollCard);
    if (!Object.values(results).some(v => v > 0)) return;

    const skill = identifySkill(message, rollCard);
    const context = buildContext(rollCard, skill);
    inject(rollCard, results, skill, context);
  });
}

function readResults(rollCard) {
  const out = { advantage:0, threat:0, triumph:0, despair:0 };
  rollCard.querySelectorAll(".net-results > span").forEach(el => {
    const symbol = String(el.textContent ?? "").trim().toLowerCase();
    if (symbol === "a") out.advantage += 1;
    else if (symbol === "h") out.threat += 1;
    else if (symbol === "t") out.triumph += 1;
    else if (symbol === "d") out.despair += 1;
  });
  return out;
}

function activeSkills() {
  if (!game.settings.get(MODULE_ID, "useActiveSkillsCompendium")) return [];
  return Array.isArray(CONFIG.genesys?.skills) ? CONFIG.genesys.skills : [];
}

function identifySkill(message, rollCard) {
  const actor = message.speakerActor ?? null;
  const description = normalizeSkillName(rollCard.querySelector(".roll-description")?.textContent);
  const actorSkills = actor
    ? actor.items.filter(i => i.type === "skill").sort((a,b) => b.name.length - a.name.length)
    : [];
  const sourceSkills = activeSkills().filter(i => i.type === "skill").sort((a,b) => b.name.length - a.name.length);

  const all = [...actorSkills];
  for (const source of sourceSkills) {
    if (!all.some(i => normalizeSkillName(i.name) === normalizeSkillName(source.name))) all.push(source);
  }

  const matched = all.find(item => {
    const n = normalizeSkillName(item.name);
    return n && description && description.includes(n);
  }) ?? null;

  if (!matched) return { item:null, name:null, category:null };

  const source = sourceSkills.find(i => normalizeSkillName(i.name) === normalizeSkillName(matched.name));
  return {
    item: matched,
    name: matched.name,
    category: source?.system?.category ?? matched.system?.category ?? null
  };
}

function buildContext(rollCard, skill) {
  const summaryTables = [...rollCard.querySelectorAll(".summary-table")];
  const looksLikeAttack = skill.category === "combat" || summaryTables.length >= 2 || Boolean(rollCard.querySelector(".qualities"));

  let criticalRating = null;
  if (summaryTables.length >= 2) {
    const counts = summaryTables[0].querySelectorAll(".count");
    if (counts.length >= 2) {
      const n = Number(counts[1].textContent);
      if (Number.isFinite(n) && n > 0) criticalRating = n;
    }
  }

  const qualities = [...rollCard.querySelectorAll(".qualities .quality")]
    .map(el => String(el.textContent ?? "").trim())
    .filter(Boolean);

  return { looksLikeAttack, criticalRating, qualities };
}

function inject(rollCard, results, skill, context) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gdh-toggle";
  button.dataset.gdhToggle = "true";
  button.innerHTML = `<span class="gdh-question">?</span><span>${t("dice.button")}</span>`;

  const panel = document.createElement("section");
  panel.className = "gdh-panel";
  panel.hidden = !game.settings.get(MODULE_ID, "expandDiceHelper");

  const diceRow = rollCard.querySelector(".dice-row");
  if (diceRow) diceRow.before(button, panel);
  else rollCard.append(button, panel);

  renderPanel(panel, results, skill, context);
  button.classList.toggle("is-open", !panel.hidden);

  button.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    panel.hidden = !panel.hidden;
    button.classList.toggle("is-open", !panel.hidden);
  });

  panel.querySelector("[data-gdh-critical]")?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    const target = [...(game.user.targets ?? [])]
      .map(token => token.actor)
      .find(actor => actor && actor.type !== "vehicle" && actor.type !== "minion") ?? null;
    openCriticalInjury({ preferredActor: target });
  });
}

function renderPanel(panel, results, skill, context) {
  const sections = [];
  const special = specialSkillKind(skill);
  const includeTerrinoth = game.settings.get(MODULE_ID, "includeTerrinoth");

  if (context.looksLikeAttack || skill.category === "combat") {
    const options = [...COMBAT_SPENDS];
    if (context.criticalRating) {
      options.push({
        symbol: "advantage",
        cost: context.criticalRating,
        text: {
          en: "Inflict one Critical Injury by spending Advantage equal to the weapon's Critical Rating.",
          uk: "Завдати 1 Critical Injury, витративши Advantage відповідно до Critical Rating зброї."
        },
        condition: {
          en: "Requires a successful attack that inflicted Wounds after Soak.",
          uk: "Потрібна успішна атака, яка завдала Wounds після Soak."
        }
      });
    }
    sections.push(spendSection(t("dice.combat"), t("dice.combatSub"), options, results));
  } else if (skill.category === "social") {
    sections.push(spendSection(t("dice.social"), t("dice.socialSub"), SOCIAL_SPENDS, results));
  } else if (skill.category === "magic") {
    sections.push(spendSection(t("dice.magic"), t("dice.magicSub"), MAGIC_SPENDS, results));
    if (game.settings.get(MODULE_ID, "showGenericGuidance")) sections.push(genericSection(results));
  } else if (special === "alchemy" && includeTerrinoth) {
    sections.push(spendSection(t("dice.alchemy"), t("dice.alchemySub"), ALCHEMY_SPENDS, results));
  } else {
    if (special === "medicine") sections.push(automaticSection(t("dice.medicine"), t("dice.medicineSub"), MEDICINE_AUTOMATIC));
    if (game.settings.get(MODULE_ID, "showGenericGuidance")) sections.push(genericSection(results));
    if (special === "mechanics" && includeTerrinoth) sections.push(spendSection(t("dice.crafting"), t("dice.craftingSub"), CRAFTING_SPENDS, results));
  }

  const canCritical = game.settings.get(MODULE_ID, "enableCriticalInjuries") && context.looksLikeAttack && (
    results.triumph >= 1 || (context.criticalRating && results.advantage >= context.criticalRating)
  );

  panel.innerHTML = `
    <header class="gdh-head">
      <div class="gdh-head-main"><strong>${t("dice.title")}</strong><span>${esc(skill.name ?? t("dice.unknownSkill"))}</span></div>
      <div class="gdh-result-strip">${resultStrip(results)}</div>
    </header>
    ${!skill.item ? `<div class="gdh-note">${t("dice.noSkill")}</div>` : ""}
    ${context.criticalRating ? `<div class="gdh-note"><strong>${t("dice.weaponCritical")}:</strong> ${costHTML("advantage", context.criticalRating)} · ${costHTML("triumph", 1)}</div>` : ""}
    ${context.qualities.length ? `<div class="gdh-note"><strong>${t("dice.weaponQualities")}:</strong> ${context.qualities.map(esc).join(", ")}</div>` : ""}
    <div class="gdh-sections">${sections.filter(Boolean).join("") || `<div class="gdh-empty">${t("dice.noOptions")}</div>`}</div>
    ${canCritical ? `<div class="gdh-critical-action"><button type="button" class="gdh-critical-button" data-gdh-critical>${t("dice.rollCritical")}</button></div>` : ""}
  `;
}

function spendSection(title, subtitle, options, results) {
  const available = options.filter(option => canUse(option, results));
  if (!available.length) return "";
  return `<section class="gdh-section"><div class="gdh-section-head"><strong>${esc(title)}</strong><span>${esc(subtitle)}</span></div><div class="gdh-options">${available.map(optionHTML).join("")}</div></section>`;
}

function automaticSection(title, subtitle, entries) {
  return `<section class="gdh-section"><div class="gdh-section-head"><strong>${esc(title)}</strong><span>${esc(subtitle)}</span></div><div class="gdh-options">${entries.map(entry => `<div class="gdh-option"><div class="gdh-cost gdh-cost-auto">AUTO</div><div class="gdh-option-body">${formatText(bilingual(entry.text))}</div></div>`).join("")}</div></section>`;
}

function genericSection(results) {
  const entries = [];
  if (results.advantage > 0) entries.push(...GENERIC_GUIDANCE.advantage.filter(x => results.advantage >= x.cost).map(x => ({symbol:"advantage", ...x})));
  if (results.triumph > 0) entries.push({symbol:"triumph", ...GENERIC_GUIDANCE.triumph[0]});
  if (results.threat > 0) entries.push({symbol:"threat", ...GENERIC_GUIDANCE.threat[0]});
  if (results.despair > 0) entries.push({symbol:"despair", ...GENERIC_GUIDANCE.despair[0]});
  if (!entries.length) return "";
  return `<section class="gdh-section"><div class="gdh-section-head"><strong>${t("dice.generic")}</strong><span>${t("dice.genericSub")}</span></div><div class="gdh-options">${entries.map(optionHTML).join("")}</div></section>`;
}

function canUse(option, results) {
  return Number(results[option.symbol] ?? 0) >= Number(option.cost ?? 1);
}

function optionHTML(option) {
  return `<div class="gdh-option"><div class="gdh-cost">${costHTML(option.symbol, option.cost)}</div><div class="gdh-option-body"><div>${formatText(bilingual(option.text))}</div>${option.condition ? `<div class="gdh-condition">${formatText(bilingual(option.condition))}</div>` : ""}</div></div>`;
}

function costHTML(symbol, cost) {
  const letter = { advantage:"a", threat:"h", triumph:"t", despair:"d" }[symbol];
  if (!letter) return "";
  return Array.from({length: Math.max(1, Number(cost) || 1)}, () => `<span class="gdh-result-glyph" aria-hidden="true">${letter}</span>`).join("");
}

function dieHTML(kind) {
  const data = kind === "boost"
    ? {letter:"B", cls:"die-B", label:"Boost die"}
    : {letter:"S", cls:"die-S", label:"Setback die"};
  return `<span class="gdh-die ${data.cls}" role="img" aria-label="${data.label}" title="${data.label}">${data.letter}</span>`;
}

function resultHTML(word) {
  const data = { Advantage:["a","Advantage"], Threat:["h","Threat"], Triumph:["t","Triumph"], Despair:["d","Despair"], Success:["s","Success"], Failure:["f","Failure"] }[word];
  return data ? `<span class="gdh-result-glyph gdh-inline-result" role="img" aria-label="${data[1]}" title="${data[1]}">${data[0]}</span>` : word;
}

function formatText(value) {
  let text = esc(value);
  text = text.replaceAll("Boost", dieHTML("boost")).replaceAll("Setback", dieHTML("setback"));
  for (const word of ["Advantage","Threat","Triumph","Despair","Success","Failure"]) text = text.replaceAll(word, resultHTML(word));
  return text;
}

function resultStrip(results) {
  return [["advantage","a"],["threat","h"],["triumph","t"],["despair","d"]]
    .filter(([key]) => results[key] > 0)
    .map(([key,letter]) => `<span class="gdh-result"><span class="gdh-result-glyph">${letter}</span><strong>${results[key]}</strong></span>`)
    .join("");
}

function esc(value) {
  return String(value ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
