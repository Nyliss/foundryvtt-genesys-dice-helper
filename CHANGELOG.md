# Changelog

## 1.1.1

### Critical Injury compendium hotfix

- Fixed concurrent Critical Injury compendium synchronization.
- Replaced destructive delete/recreate synchronization with safe upsert-by-key logic.
- Repairs partially-created Critical Injury compendia left by v1.1.0.
- Re-checks compendium lock state immediately before writes.
- Ignores harmless stale-document deletion races.
- Prevents duplicate synchronization calls in the same client.

## 1.1.0

### Module
- Renamed the visible module from **Genesys Dice Helper** to **Genesys Toolkit**.
- Kept the internal module ID `genesys-dice-helper` for seamless updates.
- Expanded the module description and README.

### Skills
- Added support for the active Skills Compendium selected in Genesys system settings.
- Reads `CONFIG.genesys.skills` populated by Genesys 0.2.19.
- Falls back to Actor-owned Skill Items when needed.

### Localization
- Added independent client language selection: Automatic, English, Українська.
- Added bilingual Dice Helper guidance and Critical Injury UI.
- Added a separate world language setting for the shared Critical Injury compendium.

### Critical Injuries
- Added Critical Injury roller.
- Added automatic +10 per existing Critical Injury.
- Added Vicious support.
- Added +10 per additional Critical activation.
- Added custom signed modifiers.
- Added automatic Horrific Injury / Gruesome Injury characteristic rolls.
- Added optional automatic native Genesys `injury` Items on Actors.
- Added chat result output.
- Added automatic world Critical Injury compendium synchronization.
- Added automatic shared Critical Injury macro creation.
- Added Dice Helper integration.

## 1.0.2
- Increased helper text size.
- Removed extra explanatory blocks and footer text from the Dice Helper card.

## 1.0.1
- Added native Genesys symbols and Boost/Setback dice.
- Limited suggestions to options affordable with actually rolled symbols.
- Added dynamic Critical Injury cost based on weapon Critical Rating.

## 1.0.0
- Initial Dice Helper release.
