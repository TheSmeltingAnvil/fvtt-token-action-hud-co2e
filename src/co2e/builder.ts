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
   * @template Key, Value
   * @param groupId - The group identifier for these actions.
   * @param values - An object whose keys and values will be used to create actions.
   * @param configure - A callback to further configure each ActionBuilder instance.
   * @returns The GroupBuilder instance for chaining.
   */
  with<Key extends string, Value>(
    groupId: string,
    values: Record<Key, Value>,
    configure: (builder: ActionBuilder<Key, Value>, key: Key, value: Value) => ActionBuilder<Key, Value>,
  ): GroupBuilder {
    for (const [key, value] of Object.entries(values) as [Key, Value][]) {
      let builder = new ActionBuilder(this.Utils, groupId, key, value);
      builder = configure(builder, key, value);
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
      groupId: this.groupId,
      actions: this.#actions,
    };
  }
}

/**
 * ActionBuilder is used to construct individual actions for the Token Action HUD system.
 * It provides a fluent API for setting action properties before building the final Action object.
 */
class ActionBuilder<Key extends string, Value> {
  #label = "";
  #actionType: string;
  #info1: string;

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
    private value: Value,
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
   * Set the info1 property for the action (additional info, e.g., modifier).
   * @param info - The info string.
   * @returns The ActionBuilder instance for chaining.
   */
  withInfo1(info: string): ActionBuilder<Key, Value> {
    this.#info1 = info;
    return this;
  }

  /**
   * Set the action type for the action (e.g., 'rollAbility').
   * @param actionType - The type of action.
   * @returns The ActionBuilder instance for chaining.
   */
  withActionType(actionType: string): ActionBuilder<Key, Value> {
    this.#actionType = actionType;
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
      info1: { text: this.#info1 }, //: ability.value, //typeof action === 'string' ? '' : this.#getActionModifier(action),
      system: { actionType: this.#actionType, actionId: this.key },
    } as Action;
  }
}
