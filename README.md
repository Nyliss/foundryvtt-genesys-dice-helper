# Genesys Toolkit

A quality-of-life toolkit for the **Genesys Roleplaying System** in **Foundry VTT**.

This project began as **Genesys Dice Helper**. Starting with v1.1.0 it becomes **Genesys Toolkit**, while keeping the original internal module ID so existing Foundry/Sqyre installations can update normally.

## Compatibility

Built and checked for:

- **Foundry VTT 13.351**
- **Genesys system 0.2.19**

## Features

### 🎲 Dice Helper

Adds **Help Spending Results** directly to native Genesys chat rolls.

- Reads the remaining Advantage, Threat, Triumph, and Despair.
- Shows only options affordable with the symbols actually rolled.
- Uses native Genesys result and Boost/Setback glyphs.
- Supports combat, structured social encounters, magic, Medicine, Alchemy, crafting, and general narrative guidance.
- Offers **Roll Critical Injury** directly from a qualifying combat result.

### 🧠 Active Genesys Skills Compendium

Genesys 0.2.19 already has a world setting named **Skills Compendium**. The system loads the selected pack into `CONFIG.genesys.skills`.

Genesys Toolkit follows that active source by default. This allows custom Fantasy, Enkor, and other setting skill lists to work without hard-coding a specific pack name.

### 💥 Critical Injuries

The Toolkit adds a Critical Injury workflow based on the Genesys Core Rulebook.

On GM world load it can automatically create:

- **Genesys Toolkit — Critical Injuries** world Item compendium;
- shared **Genesys Toolkit: Critical Injury** macro.

The roller:

- rolls d100;
- adds **+10 per existing Critical Injury** automatically;
- supports **Vicious** (+10 per rank);
- supports **additional Critical activations** (+10 each beyond the first);
- accepts any additional positive or negative modifier;
- finds the resulting Critical Injury;
- automatically rolls the affected characteristic for Horrific Injury and Gruesome Injury;
- optionally adds the result as a native Genesys `injury` Item to the Actor;
- posts the result to chat.

The Toolkit does **not** automatically reduce characteristics or enforce every ongoing Injury effect. Those remain visible on the Injury Item for table/GM adjudication.

### 🌐 English / Українська

The Toolkit has an independent **client language** setting:

- Automatic
- English
- Українська

Dice Helper text and Critical Injury UI follow that setting.

The Critical Injury compendium has a separate **world language** setting, because all users in a world share the same compendium.

## Settings

Open:

**Game Settings → Configure Settings → Module Settings**

Settings include:

- Module Language / Мова модуля
- Use Active Genesys Skills Compendium
- Enable Dice Helper
- Include Realms of Terrinoth Results
- Show General Narrative Guidance
- Expand Dice Helper Automatically
- Enable Critical Injury Tools
- Critical Injury Compendium Language
- Sync Critical Injury Compendium
- Create Critical Injury Macro
- Apply Critical Injury by Default

## Installation

Manifest URL:

`https://raw.githubusercontent.com/Nyliss/foundryvtt-genesys-dice-helper/main/module.json`

## Upgrade from Genesys Dice Helper v1.0.x

The visible module title changes to **Genesys Toolkit**, but the internal module ID remains:

`genesys-dice-helper`

This is intentional. Foundry and Sqyre should treat v1.1.0 as an update to the existing module rather than as a separate installation.

## Rules reference

Critical Injury ranges, severities, and mechanics are based on the Genesys Core Rulebook. The included descriptions are concise paraphrases for reference use and are not a replacement for the rulebook.

## License

Module code is MIT licensed. Genesys and its trademarks belong to their respective owners. This is an unofficial fan-made quality-of-life module.
