import GroupBuilder, { ActionBuilder, IconType } from "./builder";
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
    .with(abilities, (builder, ability, key: AbilityName) =>
      builder
        .withLabel(SYSTEM.ABILITIES[key].label)
        .withInfo1(ability.value > 0 ? `+${ability.value}` : `${ability.value}`)
        .withCSSClass(ability.superior ? "superior" : "")
        .withTooltip(ability.superior ? { content: Utils.i18n("CO.label.long.superior"), direction: "UP" } : "")
        .withActionType("rollAbility"),
    )
    .build();
};

export const buildResourcesActions = (Utils: Co2Utils, actor: COActor) => {
  const resources = { fortune: actor.system.resources.fortune };
  return new GroupBuilder("resources", Utils)
    .with(resources, (builder, resource, key: ResourceName) =>
      builder
        .withLabel(SYSTEM.RESOURCES[key].label)
        .withIcon('<i class="fas fa-fw fa-clover"></i>')
        .withInfo1(`${resource.value ?? 0}` + (resource.max ? `/${resource.max}` : ""))
        .withActionType("rollFortune"),
    )
    .build();
};

/** Rest actions shipped by CO2 itself, before 2.3.0 moved them out to content modules. */
const LEGACY_REST_ACTIONS: CORestAction[] = [
  {
    id: "full",
    icon: "fa-solid fa-bed",
    label: "CO.ui.fullRest",
    handler: (actor) => actor.system.useRecovery(true),
  },
  {
    id: "fast",
    icon: "fa-solid fa-mug-saucer",
    label: "CO.ui.fastRest",
    handler: (actor) => actor.system.useRecovery(false),
  },
];

/**
 * The rest actions declared by the active content module (cof2-base for COF2).
 * Same story as {@link getDefenseStances}: since CO2 2.3.0 recovery rules belong to the setting,
 * so the system only exposes an empty registry and keeps the mechanics themselves.
 */
export const getRestActions = (): CORestAction[] => {
  return game.system.CONST && game.system.CONST.restActions ? game.system.CONST.restActions : LEGACY_REST_ACTIONS;
};

export const buildRecoveryActions = (Utils: Co2Utils, _actor: COActor) => {
  const actions = getRestActions().reduce(
    (acc, rest) => {
      acc[rest.id] = { name: rest.label, icon: `<i class="${rest.icon}"></i>` };
      return acc;
    },
    {} as Record<string, { name: string; icon: string }>,
  );
  return new GroupBuilder("recovery", Utils)
    .with(actions, (builder, action) =>
      builder.withLabel(action.name).withIcon(action.icon).withActionType("useRecovery"),
    )
    .build();
};

/** Defense stances shipped by CO2 itself, before 2.3.0 moved them out to content modules. */
const LEGACY_DEFENSE_STANCES: CODefenseStance[] = [
  {
    id: "fullDef",
    icon: "fa-solid fa-shield",
    activateLabel: "CO.customStatus.fullDef",
    deactivateLabel: "CO.customStatus.fullDef",
  },
  {
    id: "partialDef",
    icon: "fa-solid fa-shield-halved",
    activateLabel: "CO.customStatus.partialDef",
    deactivateLabel: "CO.customStatus.partialDef",
  },
];

/**
 * The defense stances declared by the active content module (cof2-base for COF2).
 * Since CO2 2.3.0 defense stances are no longer part of the system: it only exposes an empty
 * registry that each content module fills on its own `init` hook. An empty registry therefore
 * means the current setting has no defense stances at all and nothing should be displayed.
 * A missing registry means a system older than 2.3.0, where both stances were built in.
 */
export const getDefenseStances = (): CODefenseStance[] =>
  game.system.CONST && game.system.CONST.defenseStances ? game.system.CONST.defenseStances : LEGACY_DEFENSE_STANCES;

export const buildDefenseActions = (Utils: Co2Utils, actor: COActor) => {
  const actions = getDefenseStances().reduce(
    (acc, stance) => {
      const active = actor?.hasEffect(stance.id) ?? false;
      acc[stance.id] = {
        name: active ? stance.deactivateLabel : stance.activateLabel,
        icon: `<i class="${stance.icon}"></i>`,
      };
      return acc;
    },
    {} as Record<string, { name: string; icon: string }>,
  );
  return new GroupBuilder("defense", Utils)
    .with(
      actions,
      (builder, action) => builder.withLabel(action.name).withIcon(action.icon).withActionType("useDefense"), // activateDef
    )
    .build();
};

export const buildAttacksActions = (Utils: Co2Utils, actor: COActor) => {
  const actions = actor.system.attacks.reduce(
    (acc, attack) => {
      acc[attack.id] = attack;
      return acc;
    },
    {} as Record<string, COItem>,
  );
  return new GroupBuilder("attacks", Utils)
    .with(actions, (builder, action) =>
      builder
        .withLabel(action.name)
        .withIcon(action.actions.length > 0 ? action.actions[0]?.icon : undefined)
        .withActionType("useAttack", `${action.uuid}:${action.actions.length > 0 ? 0 : null}`),
    )
    .build();
};

export const buildActionsActions = async (Utils: Co2Utils, actor: COActor) => {
  const actions = await actor.getVisibleActivableActions();
  return new GroupBuilder("actions", Utils)
    .with(
      actions.reduce(
        (acc, action) => {
          acc[action.source.split(".").pop()! + ":" + action.indice] = action;
          return acc;
        },
        {} as Record<string, COAction>,
      ),
      (builder, action) =>
        fromAction(builder, action)
          .withIcon(action.icon)
          .withActionType("useAction", action.source + ":" + action.indice),
    )
    .build();
};

export const buildInventoryActions = (Utils: Co2Utils, actor: COActor) => {
  const inventory = actor.inventory;
  return inventory.map((group) => {
    return new GroupBuilder(group.category, Utils)
      .with(
        group.items.reduce(
          (acc, item) => {
            acc[item.uuid] = item;
            return acc;
          },
          {} as Record<string, COItem>,
        ),
        (builder, item) =>
          builder
            .withLabel(item.name)
            .withImage(item.img)
            .withIcon(
              (() => {
                if (item.system.equipped) {
                  if (item.system.isArmor) return IconType.EQUIPPED;
                  if (item.system.isShield) return IconType.WORN_SHIELD;
                  return IconType.WORN;
                }
                if (item.system.properties.stackable && item.system.hasQuantity && item.system.quantity.current > 1)
                  return IconType.CONSUMABLE;
                if (item.system.properties.reloadable && item.system.hasCharges && item.system.charges.current > 1)
                  return IconType.CONSUMABLE_AMMO;
                return false;
              })(),
            )
            .withInfo1(
              item.system.properties.stackable && item.system.hasQuantity && item.system.quantity.current > 1
                ? `${item.system.quantity.current}` + (item.system.quantity.max ? `/${item.system.quantity.max}` : "")
                : undefined,
            )
            .withInfo2(
              item.system.properties.reloadable && item.system.hasCharges && item.system.charges.current > 1
                ? `${item.system.charges.current}` + (item.system.charges.max ? `/${item.system.charges.max}` : "")
                : undefined,
            )
            .withInfo3(item.system.range?.value ? `(${item.system.range.value}${item.system.range.unit})` : undefined)
            .withActionType("toggleEquipmentOrUseConsumable", item.uuid),
      )
      .build();
  });
};

export const buildCapacitiesActions = async (Utils: Co2Utils, actor: COActor) => {
  const paths = actor.paths;
  return await Promise.all(
    paths.map(async (path) => {
      // @ts-expect-error --IGNORE--
      const capacities = (await Promise.all(path.system.capacities.map((uuid) => fromUuid(uuid, { relative: actor }))))
        // @ts-expect-error --IGNORE--
        .filter((capacity) => !!capacity && capacity.system.isLearned)
        .reduce(
          (acc, capacity) => {
            // @ts-expect-error --IGNORE--
            acc[capacity.id] = capacity as COCapacity;
            return acc;
          },
          {} as Record<string, COCapacity>,
        );
      return new GroupBuilder(path.system.slug, Utils)
        .with(capacities, (builder, capacity) =>
          builder
            .withLabel(capacity.name + (capacity.system.isSpell ? "*" : ""))
            .withImage(capacity.img)
            .withInfo1(`R${capacity.system.rank}`)
            .withInfo2(capacity.system.hasCost && capacity.system.cost ? `Coût: ${capacity.system.cost}` : "")
            .withCSSClass(capacity.system.isSpell ? "spell" : "")
            .withActionType("useCapacity", capacity.uuid),
        )
        .build();
    }),
  );
};

export const buildOffPathCapacitiesActions = async (Utils: Co2Utils, actor: COActor) => {
  const capacities = actor.capacitiesOffPaths?.reduce(
    (acc: Record<string, COCapacity>, capacity: COCapacity) => {
      acc[capacity.uuid.split(".").pop()!] = capacity as COCapacity;
      return acc;
    },
    {} as Record<string, COCapacity>,
  );
  return new GroupBuilder("capacities", Utils)
    .with(capacities, (builder, capacity: COCapacity) =>
      builder
        .withLabel(capacity.name)
        .withImage(capacity.img)
        .withInfo1(capacity.system.hasCost && capacity.system.cost ? `Coût: ${capacity.system.cost}` : "")
        .withCSSClass(capacity.system.isSpell ? "spell" : "")
        .withActionType("useCapacity", capacity.uuid),
    )
    .build();
};

export const buildEffectsActions = async (Utils: Co2Utils, actor: COActor) => {
  const permanentActions: COAction[] = await actor.getVisibleNonActivableNonTemporaireActions();
  const permanentActionsKeyed = permanentActions.reduce(
    (acc, action) => {
      acc[action.source.split(".").pop()!] = action as COAction;
      return acc;
    },
    {} as Record<string, COAction>,
  );
  const permanentGroup = new GroupBuilder("permanent_effects", Utils)
    .with(permanentActionsKeyed, (builder, action) =>
      builder
        .withLabel(action.itemName + (action.hasLabel ? ` - ${action.label}` : ""))
        .withImage(action.actionImg)
        .withActionType("toggleEffect", action.source),
    )
    .build();

  const temporaryActions: COAction[] = await actor.getVisibleActivableTemporaireActions();
  const temporaryActionsKeyed = temporaryActions.reduce(
    (acc, action) => {
      acc[action.source.split(".").pop()! + ":" + action.indice] = action as COAction;
      return acc;
    },
    {} as Record<string, COAction>,
  );
  const temporaryGroup = new GroupBuilder("temporary_effects", Utils)
    .with(temporaryActionsKeyed, (builder, action) =>
      fromAction(builder, action)
        .withIcon(action.properties.enabled ? IconType.ACTIVE : undefined)
        .withActionType("toggleEffect", action.source + ":" + action.indice),
    )
    .build();

  return [permanentGroup, temporaryGroup];
};

function fromAction(builder: ActionBuilder<string, COAction>, action: COAction): ActionBuilder<string, COAction> {
  return builder
    .withLabel(action.itemName + (action.hasLabel ? ` - ${action.label}` : ""))
    .withImage(action.actionImg)
    .withInfo1(action.hasCharges ? `${action.charges}` : "");
}
