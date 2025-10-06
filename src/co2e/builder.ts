import { Co2Utils } from "./createUtils";

/**
 * GroupBuilder is used to construct a group of actions for the Token Action HUD system.
 * It allows you to batch-create actions with custom configuration for each entry.
 *
 * @example
 * const builder = new GroupBuilder('abilities', Utils)
 *   .with('stats_abilities', abilities, (builder, key, ability) =>
 *     builder.withLabel(...).withInfo1(...).withActionType(...)
 *   );
 * const group = builder.build();
 */
export default class GroupBuilder {
  #actions: Action[] = [];

  /**
   * Create a new GroupBuilder.
   * @param groupId - The unique identifier for the group.
   * @param Utils - Utility class for localization and other helpers.
   */
  constructor(
    private groupId: string,
    private Utils: Co2Utils,
  ) {}

  /**
   * Add actions to the group for each entry in the provided values object.
   * @template string, Value
   * @param groupId - The group identifier for these actions.
   * @param values - An object whose keys and values will be used to create actions.
   * @param configure - A callback to further configure each ActionBuilder instance.
   * @returns The GroupBuilder instance for chaining.
   */
  with<Key extends string, Value = unknown>(
    values: Record<string, Value>,
    configure: (builder: ActionBuilder<Key, Value>, value: Value, key: Key) => ActionBuilder<Key, Value>,
  ): GroupBuilder {
    for (const [key, value] of Object.entries(values) as [Key, Value][]) {
      let builder = new ActionBuilder<Key, Value>(this.Utils, this.groupId, key);
      builder = configure(builder, value, key);
      this.#actions.push(builder.build());
    }
    return this;
  }

  /**
   * Finalize and return the group object containing all configured actions.
   * @returns An object with groupId and actions array.
   */
  build(): {
    groupId: string;
    actions: Action[];
  } {
    return {
      groupId: `${this.groupId}`,
      actions: this.#actions,
    };
  }
}

export enum IconType {
  ACTIVE = "fa-solid fa-check fa-fw",
  CONSUMABLE = "fa-solid fa-drumstick-bite fa-fw",
  CONSUMABLE_AMMO = "fa-solid bullseye-arrow fa-fw",
  EQUIPPED = "fa-solid fa-helmet-battle fa-fw",
  WORN = "fa-solid fa-hand-fist fa-fw fa-rotate-90",
  WORN_SHIELD = "fa-solid fa-shield-halved fa-fw",
}

/**
 * ActionBuilder is used to construct individual actions for the Token Action HUD system.
 * It provides a fluent API for setting action properties before building the final Action object.
 */
export class ActionBuilder<Key extends string = string, Value = unknown> {
  #label = "";
  #actionType?: string;
  #icon?: string;
  #info1?: string;
  #info2?: string;
  #info3?: string;
  #image?: string;
  #cssClass: string[] = [];
  #tooltip: string | { content: string; class?: string; direction: "UP" | "DOWN" | "LEFT" | "RIGHT" | "CENTER" } = "";

  /**
   * Create a new ActionBuilder.
   * @param UtilsType - Utility class for localization and other helpers.
   * @param groupId - The group identifier this action belongs to.
   * @param key - The key for this action (usually from the values object).
   * @param value - The value for this action (usually from the values object).
   */
  constructor(
    private UtilsType: typeof Utils,
    private groupId: string,
    private key: Key,
  ) {}

  /**
   * Set the label for the action (will be localized).
   * @param label - The label string.
   * @returns The ActionBuilder instance for chaining.
   */
  withLabel(label: string): ActionBuilder<Key, Value> {
    this.#label = label;
    return this;
  }

  /**
   * Set the style for the action (e.g., 'bold', 'italic').
   * @param value - The CSS class or style for the action.
   * @returns The ActionBuilder instance for chaining.
   */
  withCSSClass(value: string | string[] | undefined): ActionBuilder<Key, Value> {
    if (!value) return this;
    if (typeof value === "string") this.#cssClass.push(value);
    else this.#cssClass.push(...value);
    return this;
  }

  /**
   * Set the info1 property for the action (additional info, e.g., modifier).
   * @param info - The info string.
   * @returns The ActionBuilder instance for chaining.
   */
  withInfo1(info?: string): ActionBuilder<Key, Value> {
    if (!info) return this;
    this.#info1 = info;
    return this;
  }

  /**
   * Set the info1 property for the action (additional info, e.g., modifier).
   * @param info - The info string.
   * @returns The ActionBuilder instance for chaining.
   */
  withInfo2(info?: string | false): ActionBuilder<Key, Value> {
    if (!info) return this;
    this.#info2 = info;
    return this;
  }

  /**
   * Set the info1 property for the action (additional info, e.g., modifier).
   * @param info - The info string.
   * @returns The ActionBuilder instance for chaining.
   */
  withInfo3(info?: string): ActionBuilder<Key, Value> {
    if (!info) return this;
    this.#info3 = info;
    return this;
  }

  /**
   * Set the info1 property for the action (additional info, e.g., modifier).
   * @param info - The info string.
   * @returns The ActionBuilder instance for chaining.
   */
  withIcon(icon: IconType | string | false | undefined): ActionBuilder<Key, Value> {
    if (!icon) this.#icon = undefined;
    else if (typeof icon === "string" && Object.values(IconType).includes(icon as IconType))
      this.#icon = `<i class="${icon}"></i>`;
    else this.#icon = icon;
    return this;
  }

  /**
   * Set the info1 property for the action (additional info, e.g., modifier).
   * @param info - The info string.
   * @returns The ActionBuilder instance for chaining.
   */
  withImage(image: string | false | undefined): ActionBuilder<Key, Value> {
    if (!image) this.#image = undefined;
    else this.#image = image;
    return this;
  }

  /**
   * Set the action type for the action (e.g., 'rollAbility').
   * @param actionType - The type of action.
   * @returns The ActionBuilder instance for chaining.
   */
  withTooltip(
    tooltip: string | { content: string; class?: string; direction: "UP" | "DOWN" | "LEFT" | "RIGHT" | "CENTER" },
  ): ActionBuilder<Key, Value> {
    this.#tooltip = tooltip;
    return this;
  }

  /**
   * Set the action type for the action (e.g., 'rollAbility').
   * @param actionType - The type of action.
   * @returns The ActionBuilder instance for chaining.
   */
  withActionType(actionType: string, actionId: Key | undefined = undefined): ActionBuilder<Key, Value> {
    this.#actionType = actionType;
    if (actionId) this.key = actionId;
    return this;
  }

  /**
   * Build and return the final Action object.
   * @returns The constructed Action object.
   */
  build(): Action {
    return {
      id: `${this.groupId}-${this.key}`,
      name: this.UtilsType.i18n(this.#label),
      cssClass: this.#cssClass.length > 0 ? this.#cssClass.join(" ") : undefined,
      icon1: this.#icon,
      img: this.#image,
      info1: this.#info1 && { text: this.#info1 },
      info2: this.#info2 && { text: this.#info2 },
      info3: this.#info3 && { text: this.#info3 },
      tooltip: this.#tooltip,
      system: { actionType: this.#actionType, actionId: this.key },
    } as Action;
  }
}
