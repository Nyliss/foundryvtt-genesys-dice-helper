const L = (en, uk) => Object.freeze({ en, uk });

export const CRITICAL_INJURIES = Object.freeze([
  { key:"minor-nick", min:1, max:5, severity:"easy", name:L("Minor Nick","Незначна подряпина"), effect:L("Suffer 1 Strain.","Отримати 1 Strain.") },
  { key:"slowed-down", min:6, max:10, severity:"easy", name:L("Slowed Down","Сповільнення"), effect:L("On the target's next turn, they act only in the last allied Initiative slot.","У наступний хід ціль діє лише в останньому союзному Initiative slot.") },
  { key:"sudden-jolt", min:11, max:15, severity:"easy", name:L("Sudden Jolt","Раптовий удар"), effect:L("Drop whatever the target is holding.","Ціль упускає все, що тримає в руках.") },
  { key:"distracted", min:16, max:20, severity:"easy", name:L("Distracted","Відволікання"), effect:L("The target cannot perform a free Maneuver during their next turn.","У наступний хід ціль не може виконати безкоштовний Maneuver.") },
  { key:"off-balance", min:21, max:25, severity:"easy", name:L("Off-Balance","Втрата рівноваги"), effect:L("Add one Setback die to the target's next skill check.","Додати один Setback до наступної skill check цілі.") },
  { key:"discouraging-wound", min:26, max:30, severity:"easy", name:L("Discouraging Wound","Деморалізуюча рана"), effect:L("Move one Story Point from the player pool to the GM pool; reverse this if the target is an NPC.","Перемістити один Story Point з пулу гравців до пулу GM; для NPC зробити навпаки.") },
  { key:"stunned", min:31, max:35, severity:"easy", name:L("Stunned","Оглушення"), effect:L("The target is Staggered until the end of their next turn.","Ціль Staggered до кінця свого наступного ходу.") },
  { key:"stinger", min:36, max:40, severity:"easy", name:L("Stinger","Гострий біль"), effect:L("Increase the difficulty of the target's next check by one.","Збільшити difficulty наступної check цілі на один.") },

  { key:"bowled-over", min:41, max:45, severity:"average", name:L("Bowled Over","Збито з ніг"), effect:L("The target falls Prone and suffers 1 Strain.","Ціль падає Prone та отримує 1 Strain.") },
  { key:"head-ringer", min:46, max:50, severity:"average", name:L("Head Ringer","Удар по голові"), effect:L("Until healed, increase the difficulty of all Intellect and Cunning checks by one.","До лікування збільшити difficulty усіх Intellect і Cunning checks на один.") },
  { key:"fearsome-wound", min:51, max:55, severity:"average", name:L("Fearsome Wound","Страшна рана"), effect:L("Until healed, increase the difficulty of all Presence and Willpower checks by one.","До лікування збільшити difficulty усіх Presence і Willpower checks на один.") },
  { key:"agonizing-wound", min:56, max:60, severity:"average", name:L("Agonizing Wound","Болісна рана"), effect:L("Until healed, increase the difficulty of all Brawn and Agility checks by one.","До лікування збільшити difficulty усіх Brawn і Agility checks на один.") },
  { key:"slightly-dazed", min:61, max:65, severity:"average", name:L("Slightly Dazed","Легке запаморочення"), effect:L("The target is Disoriented until this injury is healed.","Ціль Disoriented, доки цю травму не вилікують.") },
  { key:"scattered-senses", min:66, max:70, severity:"average", name:L("Scattered Senses","Розсіяні відчуття"), effect:L("Until healed, remove all Boost dice from the target's skill checks.","До лікування прибирати всі Boost dice зі skill checks цілі.") },
  { key:"hamstrung", min:71, max:75, severity:"average", name:L("Hamstrung","Підсічення"), effect:L("The target loses their free Maneuver until this injury is healed.","Ціль втрачає свій безкоштовний Maneuver, доки травму не вилікують.") },
  { key:"overpowered", min:76, max:80, severity:"average", name:L("Overpowered","Відкритий захист"), effect:L("The attacker may immediately make another attack against the target as an incidental using the same dice pool.","Атакуючий може негайно провести ще одну атаку по цілі як incidental, використовуючи той самий dice pool.") },
  { key:"winded", min:81, max:85, severity:"average", name:L("Winded","Задишка"), effect:L("Until healed, the target cannot voluntarily suffer Strain to activate abilities or gain additional Maneuvers.","До лікування ціль не може добровільно отримувати Strain для активації abilities чи додаткових Maneuvers.") },
  { key:"compromised", min:86, max:90, severity:"average", name:L("Compromised","Серйозно ослаблений"), effect:L("Until healed, increase the difficulty of all skill checks by one.","До лікування збільшити difficulty усіх skill checks на один.") },

  { key:"at-the-brink", min:91, max:95, severity:"hard", name:L("At the Brink","На межі"), effect:L("Until healed, suffer 2 Strain each time the target performs an Action.","До лікування ціль отримує 2 Strain щоразу, коли виконує Action.") },
  { key:"crippled", min:96, max:100, severity:"hard", name:L("Crippled","Покалічення"), effect:L("The GM selects one impaired limb. Until healed, checks requiring that limb increase difficulty by one.","GM обирає ушкоджену кінцівку. До лікування checks, що потребують цієї кінцівки, збільшують difficulty на один.") },
  { key:"maimed", min:101, max:105, severity:"hard", name:L("Maimed","Втрата кінцівки"), effect:L("The GM selects one limb that is permanently lost. Without a replacement, actions needing that limb are impossible; other actions gain one Setback until healed.","GM обирає кінцівку, яку ціль назавжди втрачає. Без заміни дії, що потребують цієї кінцівки, неможливі; інші дії отримують один Setback до лікування.") },
  { key:"horrific-injury", min:106, max:110, severity:"hard", name:L("Horrific Injury","Жахлива травма"), effect:L("Roll 1d10 for a characteristic. Treat that characteristic as 1 lower until this injury is healed.","Кинути 1d10 для визначення характеристики. До лікування вважати цю характеристику на 1 нижчою."), characteristicRoll:true },
  { key:"temporarily-disabled", min:111, max:115, severity:"hard", name:L("Temporarily Disabled","Тимчасово знерухомлений"), effect:L("The target is Immobilized until this injury is healed.","Ціль Immobilized, доки травму не вилікують.") },
  { key:"blinded", min:116, max:120, severity:"hard", name:L("Blinded","Осліплення"), effect:L("Until healed, the target cannot see. Upgrade the difficulty of all checks twice; Perception and Vigilance checks are upgraded three times.","До лікування ціль не бачить. Upgrade difficulty усіх checks двічі; Perception і Vigilance checks — тричі.") },
  { key:"knocked-senseless", min:121, max:125, severity:"hard", name:L("Knocked Senseless","Втрата чуттів"), effect:L("The target is Staggered until this injury is healed.","Ціль Staggered, доки травму не вилікують.") },

  { key:"gruesome-injury", min:126, max:130, severity:"daunting", name:L("Gruesome Injury","Моторошна травма"), effect:L("Roll 1d10 for a characteristic. Permanently reduce that characteristic by 1, to a minimum of 1.","Кинути 1d10 для визначення характеристики. Назавжди зменшити її на 1, до мінімуму 1."), characteristicRoll:true },
  { key:"bleeding-out", min:131, max:140, severity:"daunting", name:L("Bleeding Out","Сильна кровотеча"), effect:L("Until healed, suffer 1 Wound and 1 Strain at the start of every turn. Each 5 Wounds beyond threshold causes another Critical Injury; reroll duplicate Bleeding Out results caused this way.","До лікування на початку кожного ходу отримувати 1 Wound і 1 Strain. За кожні 5 Wounds понад threshold отримати ще одну Critical Injury; повторний Bleeding Out від цього ефекту перекидається.") },
  { key:"the-end-is-nigh", min:141, max:150, severity:"daunting", name:L("The End Is Nigh","Кінець близько"), effect:L("The target dies after the final Initiative slot of the next round unless this injury is healed first.","Ціль помирає після останнього Initiative slot наступного раунду, якщо травму не вилікують раніше.") },
  { key:"dead", min:151, max:null, severity:"-", name:L("Dead","Смерть"), effect:L("The target is dead.","Ціль помирає.") }
]);

export const CHARACTERISTIC_ROLL = Object.freeze([
  { min:1, max:3, key:"brawn" },
  { min:4, max:6, key:"agility" },
  { min:7, max:7, key:"intellect" },
  { min:8, max:8, key:"cunning" },
  { min:9, max:9, key:"presence" },
  { min:10, max:10, key:"willpower" }
]);

export function injuryForResult(value) {
  const n = Number(value);
  return CRITICAL_INJURIES.find(row => n >= row.min && (row.max === null || n <= row.max)) ?? CRITICAL_INJURIES.at(-1);
}

export function characteristicForRoll(value) {
  const n = Number(value);
  return CHARACTERISTIC_ROLL.find(row => n >= row.min && n <= row.max)?.key ?? "willpower";
}

export function localized(value, lang) {
  if (typeof value === "string") return value;
  return value?.[lang] ?? value?.en ?? value?.uk ?? "";
}
