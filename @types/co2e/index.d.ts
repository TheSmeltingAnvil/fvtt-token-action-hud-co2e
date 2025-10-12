export {};
declare global {
  const AbilityNames = ["agi", "cha", "con", "for", "int", "per", "vol"] as const;
  type AbilityName = (typeof AbilityNames)[number];

  const ResourceNames = ["fortune"] as const;
  type ResourceName = (typeof ResourceNames)[number];

  interface AbilityValue {
    base: number;
    modifiers: number;
    value: number;
    superior: boolean;
  }

  interface BaseValue {
    value: number;
  }

  interface MaxValue {
    max: number;
  }

  interface CharacterData {
    abilities: Record<AbilityName, AbilityValue>;
    attacks: COItem[];
    combat: {
      def: BaseValue;
      magic: BaseValue;
      melee: BaseValue;
      ranged: BaseValue;
    };
    resources: {
      fortune: BaseValue & MaxValue;
    };

    rollFortune: () => Promise<void>;
    useRecovery(full: boolean): Promise<void>;
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
    RESOURCES: Record<ResourceName, { id: string; label: string }>;
    SIZES;
    STATUS_EFFECT: EFFECTS.CUSTOM_STATUS_EFFECT;
    TEMPLATE: TEMPLATE.TEMPLATE;
    TOKEN_SIZE;
  };

  interface COAction extends Action {
    actionImg?: string;
    charges: number;
    hasCharges: boolean;
    hasLabel: boolean;
    icon: string;
    indice: number;
    itemName: string;
    label: string;
    properties: {
      enabled: boolean;
      activable: boolean;
      temporary: boolean;
    };
    resolvers: COResolver[];
    source: string;
  }

  interface COResolver {
    type: string;
    consume(actor: COActor, item: COItem): boolean;
  }

  interface COItem extends Item {
    actions: COAction[];
    get img(): string;
    get name(): string;
    get type(): string;
    get actions(): COAction[];
    get system(): {
      charges: { current: number; max: number | undefined };
      hasCharges: boolean;
      hasQuantity: boolean;
      equipped: boolean;
      isArmor: boolean;
      isConsumable: boolean;
      isShield: boolean;
      isWeapon: boolean;
      properties: {
        reloadable: boolean;
        stackable: boolean;
      };
      quantity: { current: number; max: number | undefined };
      range?: {
        value: number;
        unit: string;
      };
      slug: string;
    };
  }

  interface COPath extends COItem {
    get system(): {
      capacities: ItemUUID[];
      slug: string;
    };
  }

  interface COCapacity extends COItem {
    get system(): {
      rank: string;
      cost: number;
      hasCost: boolean;
      isLearned: boolean;
      isSpell: boolean;
    };
  }

  interface COActor extends Actor<TokenDocument> {
    get name(): string;
    get type(): string;
    get system(): CharacterData;

    get actions(): COAction[];
    get capacities(): { category: string; items: COCapacity[] };
    get capacitiesOffPaths(): COCapacity[];
    get consumables(): COItem[];
    get equipments(): COItem[];
    get equippedEquipments(): COItem[];
    get equippedShields(): COItem[];
    get equippedWeapons(): COItem[];
    get inventory(): { category: string; items: COItem[] }[];
    get paths(): COPath[];
    get learnedCapacities(): COCapacity[];
    get mainShield(): COItem | undefined;
    get shields(): COItem[];
    get weapons(): COItem[];

    activateAction({
      state,
      source,
      indice,
      shiftKey,
    }: {
      state: boolean;
      source: string;
      indice: number;
      shiftKey?: boolean;
    }): unknown;
    getVisibleActivableActions(): Promise<COAction[]>;
    getVisibleActivableTemporaireActions(): PromiseCOAction[];
    getVisibleNonActivableNonTemporaireActions(): Promise<COAction[]>;
    hasEffect(effect: string): boolean;

    rollAttack(item: COItem, { withDialog }: { withDialog: boolean }): Promise<void>;
    rollSkill(skillId: string, { withDialog }: { withDialog: boolean }): Promise<void>;
    toggleEquipmentEquipped(itemId: string, byPassChecks: boolean = false): unknown;
  }

  type CombatCO = Combat;

  interface COToken extends Token {
    get actor(): COActor | null;
  }
}
