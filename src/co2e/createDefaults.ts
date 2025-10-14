import { getLayout, groups } from "./constants";
import { Co2Utils } from "./createUtils";

/**
 * Factory function to create the default layout and groups for the Token Action HUD system.
 * Localizes names and list names using the provided utility.
 *
 * @param Utils - Utility class for localization and helpers.
 * @returns An object containing localized layout and groups arrays.
 */
export default function createDefaults(Utils: Co2Utils) {
  const layout = getLayout();
  return {
    layout: layout.map((item: Layout) => {
      return {
        ...item,
        listName: `${Utils.i18n("tokenActionHud.group")}: ${Utils.i18n(item.name)}`,
        name: Utils.i18n(item.name),
        groups: item.groups.map((group: Group) => ({
          ...group,
          listName: `${Utils.i18n("tokenActionHud.group")}: ${Utils.i18n(group.name)}`,
          name: Utils.i18n(group.name),
        })),
      };
    }),
    groups: groups.map((g) => ({
      ...g,
      listName: `${Utils.i18n("tokenActionHud.group")}: ${Utils.i18n(g.name)}`,
      name: Utils.i18n(g.name),
    })),
  };
}
