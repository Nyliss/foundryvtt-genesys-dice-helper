# Genesys Dice Helper

Current release: **v1.0.1**

A compact rules-reference module for **Foundry VTT 13** and the **Mezryss Genesys system**.

After a Genesys skill or attack roll appears in chat, the module adds:

**Help Spending Results**

The button expands only the options that are usable with the remaining Advantage, Threat, Triumph, and Despair.

## Compatibility

This release is written and checked against:

- **Foundry VTT 13.351**
- **Genesys system 0.2.19**

Foundry VTT 13 uses the `renderChatMessageHTML` hook for final ChatMessage HTML customization. This module uses that v13 hook rather than the older `renderChatMessage` hook.

The Genesys 0.2.19 chat templates expose the roll through:

- `.roll.roll-skill`
- `.roll-description`
- `.net-results`
- `.summary-table`
- `.qualities`

The module reads those native structures instead of creating a second roll or chat message.

## Rule Sources

The module uses concise paraphrased reference summaries from books the table is expected to own.

### Genesys Core Rulebook

- General result interpretation, pp. 23–24
- Additional Maneuver from Advantage, p. 98
- Combat result spending, pp. 103–104
- Medicine result resolution, p. 61
- Social encounter result spending and Critical Remarks, pp. 121–123
- Magic Threat / Despair consequences, pp. 210–211

### Realms of Terrinoth

- Crafting result spending, p. 113
- Alchemy result spending, p. 114
- Runes and Verse are treated as magic skills by their Foundry skill category and therefore use the Genesys magic guidance.

The module does **not** invent per-skill numerical spend tables where the Genesys books do not provide one. Ordinary skills instead receive the Core Rulebook's general narrative guidance.

## Features

- Shows only options whose **actual symbol cost is present in the roll**. A Triumph no longer causes every Advantage-cost option to appear, and Despair no longer expands every Threat-cost option.
- One Triumph can surface options explicitly listed as "Advantage or Triumph."
- One Despair can surface options explicitly listed as "Threat or Despair."
- Combat checks receive the Core combat table.
- Social skills receive the structured social encounter table.
- Magic skills receive the Core magic Threat/Despair table.
- Alchemy can use the Realms of Terrinoth Alchemy table.
- Mechanics / Ремесло displays a clearly marked optional Crafting section.
- Medicine shows its automatic wound/strain resolution rule.
- Weapon Critical Rating is read from the native Genesys attack card when available.
- Weapon qualities visible in the native attack card are listed as context.

## Settings

**World settings**
- Enable Dice Helper
- Include Realms of Terrinoth Results

**Client settings**
- Show Rulebook Sources
- Show General Narrative Guidance
- Expand Helper Automatically

## Installation

For local testing, extract this archive into:

`FoundryVTT/Data/modules/genesys-dice-helper/`

The folder must contain `module.json` at its root.

Restart Foundry, open the Genesys world, then enable **Genesys Dice Helper** in **Manage Modules**.

## Public release

The manifest is prepared for:

`https://github.com/Nyliss/foundryvtt-genesys-dice-helper`

Once that repository exists, create a GitHub Release tagged `v1.0.0` and attach:

`genesys-dice-helper-v1.0.0.zip`

Then the intended manifest URL will be:

`https://raw.githubusercontent.com/Nyliss/foundryvtt-genesys-dice-helper/main/module.json`

## Copyright / license note

The module code is MIT licensed.

Rules summaries are concise paraphrases provided as a reference aid. They are not a replacement for the Genesys rulebooks, and the module assumes the users own the books from which the rules are referenced.


## v1.0.1 UI behavior

- Result costs use the native Genesys Advantage, Threat, Triumph, and Despair glyphs.
- Boost and Setback references inside rule text use native colored die glyphs.
- Per-option source/page labels were removed from the chat card to keep the helper compact.
- Rulebook sources remain documented here in the README.
