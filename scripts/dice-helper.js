import {
  SOURCES,
  COMBAT_SPENDS,
  SOCIAL_SPENDS,
  MAGIC_NEGATIVE_SPENDS,
  ALCHEMY_SPENDS,
  CRAFTING_SPENDS,
  GENERIC_GUIDANCE,
  MEDICINE_AUTOMATIC,
  normalizeSkillName,
  specialSkillKind
} from "./rules-data.js";

const MODULE_ID = "genesys-dice-helper";
const TESTED_FOUNDRY = "13.351";
const TESTED_SYSTEM = "0.2.19";
const MODULE_VERSION = "1.0.2";

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "enabled", {
    name: "Enable Dice Helper",
    hint: "Adds Help Spending Results to Genesys rolls in chat.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    restricted: true
  });

  game.settings.register(MODULE_ID, "includeTerrinoth", {
    name: "Include Realms of Terrinoth Results",
    hint: "Adds the official Alchemy and crafting result tables from Realms of Terrinoth.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    restricted: true
  });

  game.settings.register(MODULE_ID, "showGeneric", {
    name: "Show General Narrative Guidance",
    hint: "For checks without a dedicated spending table, show the Core Rulebook's general guidance for Advantage, Threat, Triumph, and Despair.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "expandByDefault", {
    name: "Expand Helper Automatically",
    hint: "Open Help Spending Results automatically on newly rendered rolls.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });
});

Hooks.once("ready", () => {
  if (game.system?.id !== "genesys") {
    ui.notifications.error("Genesys Dice Helper can only be used with the Genesys system.");
    return;
  }

  const generation = Number(game.release?.generation ?? 0);
  if (generation !== 13) {
    ui.notifications.warn(
      `Genesys Dice Helper v${MODULE_VERSION} is built for Foundry VTT 13 (tested on ${TESTED_FOUNDRY}). Current: ${game.version ?? game.release?.version ?? "unknown"}.`
    );
  }

  if (game.system?.version !== TESTED_SYSTEM) {
    ui.notifications.warn(
      `Genesys Dice Helper v${MODULE_VERSION} is tested with Genesys ${TESTED_SYSTEM}. Current system version: ${game.system?.version ?? "unknown"}.`
    );
  }
});

/*
 * Foundry VTT v13 hook.
 * renderChatMessage was replaced by renderChatMessageHTML for ChatMessage HTML customization.
 */
Hooks.on("renderChatMessageHTML", (message, html) => {
  if (!game.settings.get(MODULE_ID, "enabled")) return;
  if (!(html instanceof HTMLElement)) return;

  const rollCard = html.querySelector(".roll.roll-skill");
  if (!rollCard) return;
  if (rollCard.querySelector("[data-gdh-toggle]")) return;

  const results = readSpendableResults(rollCard);
  if (!hasSpendableResults(results)) return;

  const skill = identifySkill(message, rollCard);
  const context = buildContext(rollCard, skill);

  injectHelper(rollCard, results, skill, context);
});

function readSpendableResults(rollCard) {
  const results = {
    advantage: 0,
    threat: 0,
    triumph: 0,
    despair: 0
  };

  rollCard
    .querySelectorAll(".net-results > span")
    .forEach(element => {
      const symbol = String(element.textContent ?? "").trim().toLowerCase();

      if (symbol === "a") results.advantage += 1;
      else if (symbol === "h") results.threat += 1;
      else if (symbol === "t") results.triumph += 1;
      else if (symbol === "d") results.despair += 1;
    });

  return results;
}

function hasSpendableResults(results) {
  return Object.values(results).some(value => value > 0);
}

function identifySkill(message, rollCard) {
  const actor = message.speakerActor ?? null;
  const description = normalizeSkillName(
    rollCard.querySelector(".roll-description")?.textContent
  );

  if (!actor || !description) {
    return {
      item: null,
      name: null,
      category: null
    };
  }

  const skills = actor.items
    .filter(item => item.type === "skill")
    .sort((a, b) => b.name.length - a.name.length);

  const item = skills.find(skill => {
    const name = normalizeSkillName(skill.name);
    return name && description.includes(name);
  }) ?? null;

  return {
    item,
    name: item?.name ?? null,
    category: item?.system?.category ?? null
  };
}

function buildContext(rollCard, skill) {
  const summaryTables = [...rollCard.querySelectorAll(".summary-table")];
  const looksLikeAttack =
    skill.category === "combat" ||
    summaryTables.length >= 2 ||
    Boolean(rollCard.querySelector(".qualities"));

  let criticalRating = null;

  if (summaryTables.length >= 2) {
    const firstCounts = summaryTables[0].querySelectorAll(".count");
    if (firstCounts.length >= 2) {
      const value = Number(firstCounts[1].textContent);
      if (Number.isFinite(value) && value > 0) {
        criticalRating = value;
      }
    }
  }

  const qualities = [...rollCard.querySelectorAll(".qualities .quality")]
    .map(element => String(element.textContent ?? "").trim())
    .filter(Boolean);

  return {
    looksLikeAttack,
    criticalRating,
    qualities
  };
}

function injectHelper(rollCard, results, skill, context) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gdh-toggle";
  button.dataset.gdhToggle = "true";
  button.innerHTML = `<span class="gdh-question">?</span><span>Help Spending Results</span>`;

  const panel = document.createElement("section");
  panel.className = "gdh-panel";
  panel.hidden = !game.settings.get(MODULE_ID, "expandByDefault");

  const diceRow = rollCard.querySelector(".dice-row");

  if (diceRow) {
    diceRow.before(button, panel);
  } else {
    rollCard.append(button, panel);
  }

  renderHelperPanel(panel, results, skill, context);

  button.classList.toggle("is-open", !panel.hidden);

  button.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    panel.hidden = !panel.hidden;
    button.classList.toggle("is-open", !panel.hidden);
  });
}

function renderHelperPanel(panel, results, skill, context) {
  const sections = [];
  const includeTerrinoth = game.settings.get(MODULE_ID, "includeTerrinoth");
  const special = specialSkillKind(skill.name);

  if (context.looksLikeAttack || skill.category === "combat") {
    const combatOptions = [...COMBAT_SPENDS];

    if (context.criticalRating) {
      combatOptions.push({
        symbol: "advantage",
        cost: context.criticalRating,
        text: "Завдати 1 Critical Injury, витративши Advantage відповідно до Critical Rating зброї.",
        condition: "Потрібна успішна атака, яка завдала Wounds після Soak."
      });
    }

    sections.push(
      spendSection(
        "Combat",
        "Core combat result options",
        combatOptions,
        results,
        context
      )
    );
  } else if (skill.category === "social") {
    sections.push(
      spendSection(
        "Social Encounter",
        "Core structured social encounter options",
        SOCIAL_SPENDS,
        results,
        context
      )
    );
  } else if (skill.category === "magic") {
    sections.push(
      spendSection(
        "Magic Risk",
        "Extra Threat / Despair consequences for magic skill checks",
        MAGIC_NEGATIVE_SPENDS,
        results,
        context
      )
    );

    if (game.settings.get(MODULE_ID, "showGeneric")) {
      sections.push(genericSection(results));
    }
  } else if (special === "alchemy" && includeTerrinoth) {
    sections.push(
      spendSection(
        "Alchemy",
        "Realms of Terrinoth potion-preparation results",
        ALCHEMY_SPENDS,
        results,
        context
      )
    );
  } else {
    if (special === "medicine") {
      sections.push(automaticSection("Medicine", MEDICINE_AUTOMATIC));
    }

    if (game.settings.get(MODULE_ID, "showGeneric")) {
      sections.push(genericSection(results));
    }

    if (special === "mechanics" && includeTerrinoth) {
      sections.push(
        spendSection(
          "Crafting Only",
          "Use this section only when this Mechanics/Ремесло check is actually a crafting check.",
          CRAFTING_SPENDS,
          results,
          context
        )
      );
    }
  }

  const cleanSections = sections.filter(Boolean);

  panel.innerHTML = `
    <header class="gdh-head">
      <div class="gdh-head-main">
        <strong>Spending Results</strong>
        <span>${escapeHTML(skill.name ?? "Skill not detected")}</span>
      </div>
      <div class="gdh-result-strip">
        ${resultStrip(results)}
      </div>
    </header>

    ${
      !skill.item
        ? `<div class="gdh-note">The skill could not be identified from the speaking Actor, so only general/card-based guidance can be shown.</div>`
        : ""
    }

    ${
      context.looksLikeAttack && context.criticalRating
        ? `<div class="gdh-note"><strong>Weapon Critical:</strong> ${costHTML("advantage", context.criticalRating)}. ${costHTML("triumph", 1)} can trigger one Critical Injury regardless of the weapon's Critical Rating.</div>`
        : ""
    }

    ${
      context.qualities.length
        ? `<div class="gdh-note"><strong>Weapon qualities on this roll:</strong> ${context.qualities.map(escapeHTML).join(", ")}. Their normal activation costs still apply unless you spend ${costHTML("triumph", 1)}.</div>`
        : ""
    }

    <div class="gdh-sections">
      ${
        cleanSections.length
          ? cleanSections.join("")
          : `<div class="gdh-empty">No book-defined result option applies to the remaining symbols.</div>`
      }
    </div>
  `;
}

function spendSection(title, subtitle, options, results, context) {
  const affordable = options.filter(option =>
    canUseOption(option, results, context)
  );

  if (!affordable.length) return "";

  return `
    <section class="gdh-section">
      <div class="gdh-section-head">
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(subtitle)}</span>
      </div>

      <div class="gdh-options">
        ${affordable.map(option => spendOptionHTML(option, context)).join("")}
      </div>
    </section>
  `;
}

function automaticSection(title, entries) {
  return `
    <section class="gdh-section">
      <div class="gdh-section-head">
        <strong>${escapeHTML(title)}</strong>
        <span>Automatic result resolution from the skill rules</span>
      </div>

      <div class="gdh-options">
        ${entries.map(entry => `
          <div class="gdh-option">
            <div class="gdh-cost gdh-cost-auto">AUTO</div>
            <div class="gdh-option-body">
              <div>${formatRuleText(entry.text)}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function genericSection(results) {
  const entries = [];

  if (results.advantage > 0) {
    for (const item of GENERIC_GUIDANCE.advantage) {
      if (item.fixedCost && results.advantage < item.fixedCost) continue;

      entries.push({
        symbol: "advantage",
        cost: item.fixedCost ?? null,
        text: item.text,
        source: item.source
      });
    }
  }

  if (results.triumph > 0) {
    entries.push({
      symbol: "triumph",
      cost: 1,
      ...GENERIC_GUIDANCE.triumph[0]
    });
  }

  if (results.threat > 0) {
    entries.push({
      symbol: "threat",
      cost: null,
      ...GENERIC_GUIDANCE.threat[0]
    });
  }

  if (results.despair > 0) {
    entries.push({
      symbol: "despair",
      cost: 1,
      ...GENERIC_GUIDANCE.despair[0]
    });
  }

  if (!entries.length) return "";

  return `
    <section class="gdh-section gdh-section-generic">
      <div class="gdh-options">
        ${entries.map(entry => genericOptionHTML(entry)).join("")}
      </div>
    </section>
  `;
}

function canUseOption(option, results, context) {
  if (option.symbol === "advantage") {
    return results.advantage >= option.cost;
  }

  if (option.symbol === "threat") {
    return results.threat >= option.cost;
  }

  if (option.symbol === "triumph") {
    return results.triumph >= option.cost;
  }

  if (option.symbol === "despair") {
    return results.despair >= option.cost;
  }

  return false;
}

function spendOptionHTML(option, context) {
  return `
    <div class="gdh-option">
      <div class="gdh-cost">${costHTML(option.symbol, option.cost)}</div>
      <div class="gdh-option-body">
        <div>${formatRuleText(option.text)}</div>
        ${
          option.condition
            ? `<div class="gdh-condition">${formatRuleText(option.condition)}</div>`
            : ""
        }
      </div>
    </div>
  `;
}

function genericOptionHTML(entry) {
  return `
    <div class="gdh-option">
      <div class="gdh-cost">
        ${costHTML(entry.symbol, entry.cost ?? 1)}
      </div>
      <div class="gdh-option-body">
        <div>${formatRuleText(entry.text)}</div>
      </div>
    </div>
  `;
}


function costHTML(symbol, cost) {
  const letter = {
    advantage: "a",
    threat: "h",
    triumph: "t",
    despair: "d"
  }[symbol];

  if (!letter) return "";

  return Array.from(
    { length: Math.max(1, Number(cost) || 1) },
    () => `<span class="gdh-result-glyph" aria-hidden="true">${letter}</span>`
  ).join("");
}

function dieHTML(kind) {
  const data = {
    boost: {
      letter: "B",
      className: "die-B",
      label: "Boost die"
    },
    setback: {
      letter: "S",
      className: "die-S",
      label: "Setback die"
    }
  }[kind];

  if (!data) return "";

  return `<span class="gdh-die ${data.className}" role="img" aria-label="${data.label}" title="${data.label}">${data.letter}</span>`;
}

function resultGlyphHTML(kind) {
  const data = {
    Advantage: ["a", "Advantage"],
    Threat: ["h", "Threat"],
    Triumph: ["t", "Triumph"],
    Despair: ["d", "Despair"],
    Success: ["s", "Success"],
    Failure: ["f", "Failure"]
  }[kind];

  if (!data) return kind;

  return `<span class="gdh-result-glyph gdh-inline-result" role="img" aria-label="${data[1]}" title="${data[1]}">${data[0]}</span>`;
}

function formatRuleText(value) {
  let text = escapeHTML(value);

  // Dice first.
  text = text.replaceAll("Boost", dieHTML("boost"));
  text = text.replaceAll("Setback", dieHTML("setback"));

  // Narrative result symbols.
  for (const word of ["Advantage", "Threat", "Triumph", "Despair", "Success", "Failure"]) {
    text = text.replaceAll(word, resultGlyphHTML(word));
  }

  return text;
}

function resultStrip(results) {
  return [
    ["advantage", "a"],
    ["threat", "h"],
    ["triumph", "t"],
    ["despair", "d"]
  ]
    .filter(([key]) => results[key] > 0)
    .map(([key, letter]) => `
      <span class="gdh-result">
        <span class="gdh-result-glyph">${letter}</span>
        <strong>${results[key]}</strong>
      </span>
    `)
    .join("");
}


function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
