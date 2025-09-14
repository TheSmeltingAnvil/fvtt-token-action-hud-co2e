export {};
declare global {
  const AbilityNames = ["agi", "cha", "con", "for", "int", "per", "vol"] as const;
  type AbilityName = (typeof AbilityNames)[number];

  interface AbilityValue {
    base: number;
    modifiers: number;
    value: number;
  }

  interface BaseValue {
    value: number;
  }

  interface CharacterData {
    abilities: Record<AbilityName, AbilityValue>;
    combat: {
      def: BaseValue;
      magic: BaseValue;
      melee: BaseValue;
      ranged: BaseValue;
    };
  }

  const SYSTEM: {
    ID: string;
    SYSTEM_DESCRIPTION: string;
    ASCII: string;
    ABILITIES: Record<AbilityName, { id: string; label: string }>;
    ACTION_TYPES: Record<ActionName, { id: string; label: string }>;
    ACTOR_ICONS: ACTOR.ACTOR_ICONS;
    ATTACK_TYPE: CHARACTER.ATTACK_TYPE;
    BASE_INITIATIVE: CHARACTER.BASE_INITIATIVE;
    BASE_DEFENSE: CHARACTER.BASE_DEFENSE;
    BASE_FORTUNE: CHARACTER.BASE_FORTUNE;
    BASE_RECOVERY: CHARACTER.BASE_RECOVERY;
    BASE_CRITICAL: CHARACTER.BASE_CRITICAL;
    CAPACITY_ACTION_TYPE: CAPACITY.CAPACITY_ACTION_TYPE;
    CAPACITY_FREQUENCY: CAPACITY.CAPACITY_FREQUENCY;
    CAPACITY_MINIMUM_LEVEL: CAPACITY.CAPACITY_MINIMUM_LEVEL;
    CHAT_MESSAGE_TYPES: CHAT.CHAT_MESSAGE_TYPES;
    COMBAT: CHARACTER.COMBAT;
    COMBAT_UNITE: COMBAT.COMBAT_UNITE;
    CONDITION_OBJECTS: ACTION.CONDITION_OBJECTS;
    CONDITION_PREDICATES: ACTION.CONDITION_PREDICATES;
    CONDITION_TARGETS: ACTION.CONDITION_TARGETS;
    CURRENCY: EQUIPMENT.EQUIPMENT_CURRENCIES;
    CUSTOM_EFFECT: EFFECTS.CUSTOM_EFFECT;
    CUSTOM_EFFECT_ELEMENT: EFFECTS.CUSTOM_EFFECT_ELEMENT;
    DICES;
    ENCOUNTER_ARCHETYPES: ENCOUNTER.ARCHETYPES;
    ENCOUNTER_CATEGORIES: ENCOUNTER.CATEGORIES;
    ENCOUNTER_BOSS_RANKS: ENCOUNTER.BOSS_RANKS;
    EQUIPMENT_DAMAGETYPE: EQUIPMENT.EQUIPMENT_DAMAGETYPE;
    EQUIPMENT_RARITY: EQUIPMENT.EQUIPMENT_RARITY;
    EQUIPMENT_SUBTYPES: EQUIPMENT.EQUIPMENT_SUBTYPES;
    EQUIPMENT_TAGS: EQUIPMENT.EQUIPMENT_TAGS;
    FAMILIES: PROFILE.FAMILIES;
    FEATURE_SUBTYPE: FEATURE.FEATURE_SUBTYPE;
    BASE_ITEM_UUID: EQUIPMENT.BASE_ITEM_UUID;
    ITEM_ICONS: ITEM.ITEM_ICONS;
    ITEM_TYPE: ITEM.ITEM_TYPE;
    MODIFIERS_TYPE: MODIFIERS.MODIFIERS_TYPE;
    MODIFIERS_SUBTYPE: MODIFIERS.MODIFIERS_SUBTYPE;
    MODIFIERS_TARGET: MODIFIERS.MODIFIERS_TARGET;
    MODIFIERS_APPLY: MODIFIERS.MODIFIERS_APPLY;
    PATH_TYPES: PATH.PATH_TYPES;
    PV;
    RECOVERY_DICES;
    MODIFIERS;
    MOVEMENT_UNIT;
    RESOLVER_TYPE: ACTION.RESOLVER_TYPE;
    RESOLVER_TARGET: ACTION.RESOLVER_TARGET;
    RESOLVER_SCOPE: ACTION.RESOLVER_SCOPE;
    RESOLVER_RESULT: ACTION.RESOLVER_RESULT;
    RESOLVER_FORMULA_TYPE: ACTION.RESOLVER_FORMULA_TYPE;
    RESOLVER_ADDITIONAL_EFFECT_STATUS: ACTION.RESOLVER_ADDITIONAL_EFFECT_STATUS;
    RESOURCES: CHARACTER.RESOURCES;
    SIZES;
    STATUS_EFFECT: EFFECTS.CUSTOM_STATUS_EFFECT;
    TEMPLATE: TEMPLATE.TEMPLATE;
    TOKEN_SIZE;
  };

  interface COItem extends Item {
    get name(): string;
    get type(): string;
    get actions(): COAction[];
  }

  interface COActor extends Actor<TokenDocument> {
    get name(): string;
    get type(): string;
    get equipments(): COItem[];
    get capacities(): COItem[];
    get capacities(): { category: string; items: COItem[] };
    get learnedCapacities(): COItem[];
    get shields(): COItem[];
    get weapons(): COItem[];
    get consumables(): COItem[];
    get equippedEquipments(): COItem[];
    get equippedWeapons(): COItem[];
    get equippedShields(): COItem[];
    get mainShield(): COItem | undefined;
    get actions(): COAction[];
    get system(): CharacterData;
    rollSkill(skillId: string, { withDialog }: { withDialog: boolean }): Promise<void>;
  }

  interface CombatCO extends Combat {}

  interface COToken extends Token {
    get actor(): COActor | null;
  }
}
