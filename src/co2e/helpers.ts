import GroupBuilder from "./builder";
import { type Co2Utils } from "./createUtils";

/**
 * Build the abilities action group for a given actor.
 * Uses the GroupBuilder to create actions for each ability, with localized labels and info.
 *
 * @param Utils - Utility class for localization and helpers.
 * @param actor - The actor whose abilities will be used to build actions.
 * @returns An object containing the groupId and an array of actions for abilities.
 */
export const buildAbilitiesActions = (Utils: Co2Utils, actor: COActor) => {
  const { abilities } = actor.system;
  return new GroupBuilder("abilities", Utils)
    .with("stats_abilities", abilities, (builder, key, ability) =>
      builder
        .withLabel(SYSTEM.ABILITIES[key].label)
        .withInfo1(ability.value > 0 ? `+${ability.value}` : `${ability.value}`)
        .withActionType("rollAbility"),
    )
    .build();
};
