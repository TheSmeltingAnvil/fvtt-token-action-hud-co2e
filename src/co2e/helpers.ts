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
        .withInfo1(resource.value + (resource.max ? `/${resource.max}` : ""))
        .withActionType("rollFortune"),
    )
    .build();
};

export const buildRecoveryActions = (Utils: Co2Utils, _actor: COActor) => {
  const actions = {
    full: { name: "CO.ui.fullRest", icon: "<i class='fa-solid fa-bed'></i>" },
    fast: { name: "CO.ui.fastRest", icon: "<i class='fa-solid fa-mug-saucer'></i>" },
  };
  return new GroupBuilder("recovery", Utils)
    .with(actions, (builder, action) =>
      builder.withLabel(action.name).withIcon(action.icon).withActionType("useRecovery"),
    )
    .build();
};

export const buildDefenseActions = (Utils: Co2Utils, _actor: COActor) => {
  const actions = {
    fullDef: { name: "CO.customStatus.fullDef", icon: "<i class='fa-solid fa-shield'></i>" },
    partialDef: { name: "CO.customStatus.partialDef", icon: "<i class='fa-solid fa-shield-halved'></i>" },
  };
  return new GroupBuilder("defense", Utils)
    .with(
      actions,
      (builder, action) => builder.withLabel(action.name).withIcon(action.icon).withActionType("useDefense"), // activateDef
    )
    .build();
};

///**
// * Retourne une Map des actions visibles groupées par type d'action
// * @returns {Promise<Map<string, Array>>} Map avec les id des types d'actions comme clés et les tableaux d'actions comme valeurs
// */
//async function getVisibleActivableActionsByActionType(actor: COActor) {
//  const allActions = await actor.getVisibleActivableActions();
//  const actionsByType = new Map();

//  // Initialiser la map avec tous les types d'actions possibles
//  for (const actionType of Object.values(SYSTEM.ACTION_TYPES)) {
//    actionsByType.set(actionType.id, []);
//  }

//  // Grouper les actions par type
//  for (const action of allActions) {
//    if (actionsByType.has(action.type)) {
//      actionsByType.get(action.type).push(action);
//    }
//  }

//  return actionsByType;
//}

///**
// * Retourne une Map des actions visibles groupées par fréquence d'action
// * @returns {Promise<Map<string, Array>>} Map avec les id des fréquences d'actions comme clés et les tableaux d'actions comme valeurs
// */
//async function getVisibleActionsByActionFrequency(actor: COActor) {
//  const allActions = await actor.getVisibleActivableActions();
//  const actionsByFrequency = new Map();

//  // Initialiser la map avec toutes les fréquences d'actions possibles
//  for (const frequency of Object.values(SYSTEM.CAPACITY_ACTION_TYPE)) {
//    actionsByFrequency.set(frequency.id, []);
//  }

//  // Grouper les actions par fréquence
//  for (const action of allActions) {
//    if (actionsByFrequency.has(action.frequency)) {
//      actionsByFrequency.get(action.frequency).push(action);
//    }
//  }

//  return actionsByFrequency;
//}

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
