import { MODULE_ID, t, language, compendiumLanguage } from "./i18n.js";
import { CRITICAL_INJURIES, injuryForResult, characteristicForRoll, localized } from "./critical-data.js";

const PACK_NAME = "genesys-toolkit-critical-injuries";
const PACK_COLLECTION = `world.${PACK_NAME}`;
const MANAGED_INJURY = "managedCriticalInjury";
const MANAGED_MACRO = "managedCriticalMacro";

let criticalCompendiumSyncPromise = null;

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rangeLabel(entry) {
  return entry.max === null
    ? `${entry.min}+`
    : `${String(entry.min).padStart(2,"0")}–${String(entry.max).padStart(2,"0")}`;
}

function itemLabel(key, lang) {
  const labels = {
    en: { range: "Range", effect: "Effect", characteristic: "Affected Characteristic" },
    uk: { range: "Діапазон", effect: "Ефект", characteristic: "Уражена характеристика" }
  };
  return labels[lang]?.[key] ?? labels.en[key];
}

function characteristicNameFor(key, lang) {
  const names = {
    brawn: { en: "Brawn", uk: "Brawn" },
    agility: { en: "Agility", uk: "Agility" },
    intellect: { en: "Intellect", uk: "Intellect" },
    cunning: { en: "Cunning", uk: "Cunning" },
    presence: { en: "Presence", uk: "Presence" },
    willpower: { en: "Willpower", uk: "Willpower" }
  };
  return names[key]?.[lang] ?? names[key]?.en ?? key;
}

function injuryData(entry, lang, characteristic = null) {
  const baseName = localized(entry.name, lang);
  const effect = localized(entry.effect, lang);
  const characteristicName = characteristic ? characteristicNameFor(characteristic, lang) : "";

  return {
    name: characteristic ? `${baseName} — ${characteristicName}` : baseName,
    type: "injury",
    img: "icons/svg/blood.svg",
    system: {
      description: [
        `<p><strong>${itemLabel("range", lang)}:</strong> ${rangeLabel(entry)}</p>`,
        `<p><strong>${itemLabel("effect", lang)}:</strong> ${esc(effect)}</p>`,
        characteristic ? `<p><strong>${itemLabel("characteristic", lang)}:</strong> ${esc(characteristicName)}</p>` : ""
      ].join(""),
      source: "Genesys Core Rulebook, p. 115",
      severity: entry.severity
    },
    flags: {
      [MODULE_ID]: {
        [MANAGED_INJURY]: true,
        criticalKey: entry.key,
        rangeMin: entry.min,
        rangeMax: entry.max,
        rolledCharacteristic: characteristic
      }
    }
  };
}

async function _syncCriticalCompendium({ notify = false } = {}) {
  if (!game.user?.isGM) return game.packs.get(PACK_COLLECTION) ?? null;
  if (!game.settings.get(MODULE_ID, "enableCriticalInjuries")) return null;
  if (!game.settings.get(MODULE_ID, "syncCriticalCompendium")) {
    return game.packs.get(PACK_COLLECTION) ?? null;
  }

  let pack = game.packs.get(PACK_COLLECTION);

  try {
    if (!pack) {
      pack = await foundry.documents.collections.CompendiumCollection.createCompendium({
        label: "Genesys Toolkit — Critical Injuries",
        name: PACK_NAME,
        type: "Item",
        package: "world",
        system: "genesys"
      });
    }

    // Foundry does not permit document changes while a compendium is locked.
    // Always unlock before synchronization, then restore the lock afterward.
    if (pack.locked) {
      await pack.configure({ locked: false });
    }

    // Re-read the pack after configuration so we do not operate on stale state.
    pack = game.packs.get(PACK_COLLECTION) ?? pack;

    const lang = compendiumLanguage();
    const existing = await pack.getDocuments();

    // Upsert by our stable criticalKey flag instead of deleting and recreating
    // the entire pack. This makes synchronization idempotent and repairs
    // partially-created packs from v1.1.0 safely.
    const byKey = new Map();
    const duplicates = [];

    for (const doc of existing) {
      if (!doc.getFlag(MODULE_ID, MANAGED_INJURY)) continue;

      const key = doc.getFlag(MODULE_ID, "criticalKey");
      if (!key) {
        duplicates.push(doc);
        continue;
      }

      if (byKey.has(key)) duplicates.push(doc);
      else byKey.set(key, doc);
    }

    const createData = [];

    for (const entry of CRITICAL_INJURIES) {
      const desired = injuryData(entry, lang);
      const current = byKey.get(entry.key);

      if (current) {
        await current.update(desired);
      } else {
        createData.push(desired);
      }
    }

    if (createData.length) {
      // A different sync path may have changed the pack state meanwhile.
      // Confirm it is still editable immediately before creation.
      if (pack.locked) {
        await pack.configure({ locked: false });
        pack = game.packs.get(PACK_COLLECTION) ?? pack;
      }

      await pack.documentClass.createDocuments(createData, {
        pack: pack.collection
      });
    }

    // Clean up duplicate/stale managed entries only after the desired set
    // exists. Missing-document errors are harmless here and are ignored.
    for (const doc of duplicates) {
      try {
        const fresh = await pack.getDocument(doc.id);
        if (fresh) await fresh.delete();
      } catch (error) {
        const message = String(error?.message ?? error);
        if (!message.includes("does not exist")) {
          console.warn("Genesys Toolkit | Could not remove stale Critical Injury entry", error);
        }
      }
    }

    if (!pack.locked) {
      await pack.configure({ locked: true });
    }

    if (notify) ui.notifications.info(t("critical.compSynced"));
    return pack;
  } catch (error) {
    console.error("Genesys Toolkit | Critical Injury compendium sync failed", error);
    ui.notifications.error(`Genesys Toolkit: ${error.message ?? error}`);

    // Lock only after all failed write attempts are finished.
    try {
      const current = game.packs.get(PACK_COLLECTION) ?? pack;
      if (current && !current.locked) await current.configure({ locked: true });
    } catch (_error) {}

    return game.packs.get(PACK_COLLECTION) ?? pack ?? null;
  }
}

export async function ensureCriticalCompendium(options = {}) {
  // Avoid concurrent syncs from ready/onChange/manual calls in the same client.
  if (criticalCompendiumSyncPromise) return criticalCompendiumSyncPromise;

  criticalCompendiumSyncPromise = _syncCriticalCompendium(options);

  try {
    return await criticalCompendiumSyncPromise;
  } finally {
    criticalCompendiumSyncPromise = null;
  }
}

export async function ensureCriticalMacro({ notify = false } = {}) {
  if (!game.user?.isGM) return null;
  if (!game.settings.get(MODULE_ID, "enableCriticalInjuries")) return null;
  if (!game.settings.get(MODULE_ID, "createCriticalMacro")) return null;

  const command = `game.modules.get("${MODULE_ID}")?.api?.openCriticalInjury?.();`;
  let macro = game.macros.find(m => m.getFlag(MODULE_ID, MANAGED_MACRO));

  const data = {
    name: t("macro.name"),
    type: "script",
    scope: "global",
    command,
    img: "icons/svg/blood.svg",
    ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS?.OBSERVER ?? 2 },
    flags: { [MODULE_ID]: { [MANAGED_MACRO]: true } }
  };

  try {
    if (macro) await macro.update(data);
    else macro = await Macro.create(data);
    if (notify && macro) ui.notifications.info(t("critical.macroCreated"));
    return macro;
  } catch (error) {
    console.error("Genesys Toolkit | Critical Injury macro creation failed", error);
    return null;
  }
}

export async function openCriticalCompendium() {
  const pack = game.packs.get(PACK_COLLECTION) ?? await ensureCriticalCompendium();
  if (!pack) return ui.notifications.warn(t("critical.noCompendium"));
  pack.render(true);
}

function validActor(actor) {
  return Boolean(actor) && actor.type !== "vehicle" && actor.type !== "minion";
}

function availableActors() {
  return game.actors
    .filter(actor => validActor(actor) && (game.user.isGM || actor.isOwner))
    .sort((a,b) => a.name.localeCompare(b.name));
}

function preferredActor(explicit = null) {
  if (validActor(explicit) && (game.user.isGM || explicit.isOwner)) return explicit;

  const controlled = canvas?.tokens?.controlled?.map(t => t.actor).find(a => validActor(a) && (game.user.isGM || a.isOwner));
  if (controlled) return controlled;

  const target = [...(game.user?.targets ?? [])].map(t => t.actor).find(a => validActor(a) && (game.user.isGM || a.isOwner));
  if (target) return target;

  if (validActor(game.user?.character) && game.user.character.isOwner) return game.user.character;
  return null;
}

export function currentCriticalCount(actor) {
  return actor?.items?.filter(item => item.type === "injury").length ?? 0;
}

function characteristicLabel(key) {
  return t(`char.${key}`);
}

async function rollCharacteristic() {
  const roll = await new Roll("1d10").evaluate();
  const value = Number(roll.total ?? 10);
  return { value, key: characteristicForRoll(value) };
}

async function applyInjury(actor, injury, characteristic = null) {
  if (!actor) return false;
  if (!game.user.isGM && !actor.isOwner) {
    ui.notifications.warn(t("critical.noPermission"));
    return false;
  }

  const data = injuryData(injury, language(), characteristic?.key ?? null);
  await actor.createEmbeddedDocuments("Item", [data]);
  return true;
}

async function postResult({ actor, d100, finalTotal, injury, breakdown, characteristic, applied }) {
  const lang = language();
  const name = localized(injury.name, lang);
  const effect = localized(injury.effect, lang);

  const content = `
    <div class="gtk-critical-chat">
      <h3>${t("critical.result")}</h3>
      <div class="gtk-critical-chat-roll">
        <span>${t("critical.base")}: <strong>${d100}</strong></span>
        <span>${t("critical.total")}: <strong>${breakdown.total >= 0 ? "+" : ""}${breakdown.total}</strong></span>
        <span>${t("critical.final")}: <strong>${finalTotal}</strong></span>
      </div>
      <div class="gtk-critical-chat-injury">
        <strong>${esc(name)}</strong>
        <span>${t("critical.severity")}: ${t(`severity.${injury.severity}`)}</span>
      </div>
      <p>${esc(effect)}</p>
      ${characteristic ? `<div class="gtk-critical-chat-row"><strong>${t("critical.characteristic")}:</strong> ${esc(characteristicLabel(characteristic.key))} <small>(1d10 = ${characteristic.value})</small></div>` : ""}
      <div class="gtk-critical-chat-row">${t("critical.current")}: <strong>${actor ? currentCriticalCount(actor) : 0}</strong></div>
      <div class="gtk-critical-chat-breakdown">Existing +${breakdown.existing * 10} · Vicious +${breakdown.vicious * 10} · Extra +${breakdown.extra * 10} · Other ${breakdown.other >= 0 ? "+" : ""}${breakdown.other}</div>
      <div class="gtk-critical-chat-status">${applied && actor ? `${t("critical.applied")}: <strong>${esc(actor.name)}</strong>` : t("critical.notApplied")}</div>
    </div>`;

  await ChatMessage.create({
    user: game.user.id,
    speaker: actor ? ChatMessage.getSpeaker({ actor }) : ChatMessage.getSpeaker({ user: game.user }),
    content
  });
}

export async function rollCriticalInjury({ actor = null, vicious = 0, extra = 0, other = 0, apply = true } = {}) {
  const target = preferredActor(actor);
  const existing = target ? currentCriticalCount(target) : 0;
  const v = Math.max(0, Math.trunc(Number(vicious) || 0));
  const e = Math.max(0, Math.trunc(Number(extra) || 0));
  const o = Math.trunc(Number(other) || 0);
  const total = existing * 10 + v * 10 + e * 10 + o;

  const roll = await new Roll("1d100").evaluate();
  const d100 = Number(roll.total ?? 1);
  const finalTotal = Math.max(1, d100 + total);
  const injury = injuryForResult(finalTotal);
  const characteristic = injury.characteristicRoll ? await rollCharacteristic() : null;
  const applied = Boolean(apply && target) ? await applyInjury(target, injury, characteristic) : false;

  await postResult({
    actor: target,
    d100,
    finalTotal,
    injury,
    breakdown: { existing, vicious: v, extra: e, other: o, total },
    characteristic,
    applied
  });

  return { actor: target, d100, finalTotal, injury, characteristic, applied };
}

export function openCriticalInjury({ preferredActor: explicit = null } = {}) {
  if (!game.settings.get(MODULE_ID, "enableCriticalInjuries")) return;
  document.querySelectorAll(".gtk-critical-overlay").forEach(el => el.remove());

  const actors = availableActors();
  const initial = preferredActor(explicit) ?? actors[0] ?? null;

  const overlay = document.createElement("div");
  overlay.className = "gtk-critical-overlay";
  document.body.appendChild(overlay);

  const state = {
    actorId: initial?.id ?? "",
    vicious: 0,
    extra: 0,
    other: 0,
    apply: game.settings.get(MODULE_ID, "criticalAutoApply")
  };

  const actor = () => game.actors.get(state.actorId) ?? null;
  const total = () => currentCriticalCount(actor()) * 10 + Math.max(0, Number(state.vicious) || 0) * 10 + Math.max(0, Number(state.extra) || 0) * 10 + (Number(state.other) || 0);

  function render() {
    const selected = actor();
    overlay.innerHTML = `
      <div class="gtk-critical-window">
        <header class="gtk-critical-header">
          <div><strong>${t("critical.title")}</strong><span>${t("critical.healingSkill")}: ${esc(CONFIG.genesys?.settings?.skillForHealingInjury ?? "—")}</span></div>
          <button type="button" class="gtk-critical-close" data-gtk-close>×</button>
        </header>
        <div class="gtk-critical-body">
          <label class="gtk-critical-field"><span>${t("critical.actor")}</span>
            <select data-gtk-actor>
              <option value="">—</option>
              ${actors.map(a => `<option value="${a.id}" ${a.id === state.actorId ? "selected" : ""}>${esc(a.name)}</option>`).join("")}
            </select>
          </label>
          <div class="gtk-critical-current"><span>${t("critical.existing")}</span><strong>${currentCriticalCount(selected)}</strong><small>${t("critical.existingHelp")}</small></div>
          <div class="gtk-critical-grid">
            <label class="gtk-critical-field"><span>${t("critical.vicious")}</span><input type="number" min="0" step="1" value="${state.vicious}" data-gtk-vicious><small>${t("critical.viciousHelp")}</small></label>
            <label class="gtk-critical-field"><span>${t("critical.extra")}</span><input type="number" min="0" step="1" value="${state.extra}" data-gtk-extra><small>${t("critical.extraHelp")}</small></label>
            <label class="gtk-critical-field gtk-critical-wide"><span>${t("critical.other")}</span><input type="number" step="1" value="${state.other}" data-gtk-other><small>${t("critical.otherHelp")}</small></label>
          </div>
          <div class="gtk-critical-total"><span>${t("critical.total")}</span><strong data-gtk-total>${total() >= 0 ? "+" : ""}${total()}</strong></div>
          <label class="gtk-critical-check"><input type="checkbox" data-gtk-apply ${state.apply ? "checked" : ""}><span>${t("critical.apply")}</span></label>
        </div>
        <footer class="gtk-critical-footer">
          <button type="button" class="gtk-critical-button" data-gtk-compendium>${t("critical.openCompendium")}</button>
          <button type="button" class="gtk-critical-button gtk-critical-primary" data-gtk-roll ${selected ? "" : "disabled"}>${t("critical.roll")}</button>
        </footer>
      </div>`;

    overlay.querySelector("[data-gtk-close]")?.addEventListener("click", () => overlay.remove());
    overlay.querySelector("[data-gtk-actor]")?.addEventListener("change", e => { state.actorId = e.currentTarget.value; render(); });
    overlay.querySelector("[data-gtk-vicious]")?.addEventListener("input", e => { state.vicious = e.currentTarget.value; refreshTotal(); });
    overlay.querySelector("[data-gtk-extra]")?.addEventListener("input", e => { state.extra = e.currentTarget.value; refreshTotal(); });
    overlay.querySelector("[data-gtk-other]")?.addEventListener("input", e => { state.other = e.currentTarget.value; refreshTotal(); });
    overlay.querySelector("[data-gtk-apply]")?.addEventListener("change", e => { state.apply = e.currentTarget.checked; });
    overlay.querySelector("[data-gtk-compendium]")?.addEventListener("click", () => openCriticalCompendium());
    overlay.querySelector("[data-gtk-roll]")?.addEventListener("click", async e => {
      e.currentTarget.disabled = true;
      try {
        if (!actor()) return ui.notifications.warn(t("critical.noActor"));
        await rollCriticalInjury({ actor: actor(), vicious: state.vicious, extra: state.extra, other: state.other, apply: state.apply });
        overlay.remove();
      } catch (error) {
        console.error("Genesys Toolkit | Critical Injury roll failed", error);
        ui.notifications.error(`Genesys Toolkit: ${error.message ?? error}`);
        e.currentTarget.disabled = false;
      }
    });
  }

  function refreshTotal() {
    const el = overlay.querySelector("[data-gtk-total]");
    if (el) el.textContent = `${total() >= 0 ? "+" : ""}${total()}`;
  }

  render();
}

export function getCriticalCompendium() {
  return game.packs.get(PACK_COLLECTION) ?? null;
}
