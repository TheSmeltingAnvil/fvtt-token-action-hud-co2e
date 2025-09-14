export const groups: Group[] = [
  // in order of appearance
  {
    id: "abilities",
    nestId: "stats_abilities",
    name: "CO2.Groups.Abilities",
    type: "system",
  },
] as const;

export const layout: Layout[] = [
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
] as const;
