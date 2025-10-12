export const groups: Group[] = [
  // in order of appearance
  {
    id: "abilities",
    nestId: "stats_abilities",
    name: "CO2.Groups.Abilities",
    type: "system",
  },
  {
    id: "resources",
    nestId: "stats_resources",
    name: "CO2.Groups.Resources",
    type: "system",
  },
  {
    id: "defense",
    nestId: "actions_defense",
    name: "CO2.Groups.Defense",
    type: "system",
  },
  {
    id: "attacks",
    nestId: "actions_attacks",
    name: "CO2.Groups.Attacks",
    type: "system",
  },
  {
    id: "actions",
    nestId: "actions_others",
    name: "CO2.Groups.Actions",
    type: "system",
  },
  {
    id: "weapon",
    nestId: "inventory_weapon",
    name: "CO2.Groups.Weapons",
    type: "system",
  },
  {
    id: "armor",
    nestId: "inventory_armor",
    name: "CO2.Groups.Armors",
    type: "system",
  },
  {
    id: "shield",
    nestId: "inventory_shield",
    name: "CO2.Groups.Shields",
    type: "system",
  },
  {
    id: "consumable",
    nestId: "inventory_consumable",
    name: "CO2.Groups.Consumables",
    type: "system",
  },
  {
    id: "misc",
    nestId: "inventory_misc",
    name: "CO2.Groups.Misc",
    type: "system",
  },
  // paths subgroups are dynamic and created based on the actual paths in the world!
  {
    id: "temporary_effects",
    nestId: "effects_temporary",
    name: "CO2.Groups.TemporaryEffects",
    type: "system",
  },
  {
    id: "permanent_effects",
    nestId: "effects_permanent",
    name: "CO2.Groups.PermanentEffects",
    type: "system",
  },
  {
    id: "recovery",
    nestId: "utility_recovery",
    name: "CO2.Groups.Recovery",
    type: "system",
  },
  {
    id: "token",
    nestId: "utility_token",
    name: "tokenActionHud.token",
    type: "system",
  },
] as const;

const layout: Layout[] = [
  // in order of appearance
  {
    id: "stats",
    nestId: "stats",
    name: "CO2.Groups.Stats",
    groups: groups.filter((g) => g.nestId.startsWith("stats_")),
    settings: {
      customWidth: 800,
    },
  },
  {
    id: "actions",
    nestId: "actions",
    name: "CO2.Groups.Actions",
    groups: groups.filter((g) => g.nestId.startsWith("actions_")),
    settings: {
      customWidth: 400,
    },
  },
  {
    id: "inventory",
    nestId: "inventory",
    name: "CO2.Groups.Inventory",
    groups: groups.filter((g) => g.nestId.startsWith("inventory_")),
    settings: {
      customWidth: 1200,
    },
  },
  {
    id: "paths",
    nestId: "paths",
    name: "CO2.Groups.Paths",
    groups: [], // dynamic, see createLayout function below
    settings: {
      customWidth: 800,
    },
  },
  {
    id: "effects",
    nestId: "effects",
    name: "CO2.Groups.Effects",
    groups: groups.filter((g) => g.nestId.startsWith("effects_")),
  },
  {
    nestId: "utility",
    id: "utility",
    name: "tokenActionHud.utility",
    groups: groups.filter((g) => g.nestId.startsWith("utility_")),
  },
] as const;

export function createLayout(): Layout[] {
  const paths = game.items.filter((i) => i.type === "path");
  const pathsLayout = layout.find((l) => l.id === "paths");
  pathsLayout!.groups = paths.map((path) => ({
    id: path.system.slug,
    nestId: `paths_${path.system.slug}`,
    name: path.name,
    type: "system",
  }));
  pathsLayout!.groups.push({
    id: "capacities",
    nestId: "paths_capacities",
    name: "CO2.Groups.OffPathCapacities",
    type: "system",
  });
  return layout;
}
