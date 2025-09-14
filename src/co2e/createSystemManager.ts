/**
 * Factory function to create the Token Action HUD system manager for the CO2E system.
 * @param coreModule - The Token Action HUD core module instance.
 * @param Co2ActionHandler - The action handler class for COActor and COToken.
 * @param Co2RollHandler - The roll handler class for COActor and COToken.
 * @param defaults - The default layout and groups for the HUD.
 * @returns A class extending SystemManager for COActor and COToken.
 */
export default function createSystemManager(
  coreModule: TokenActionHudCoreModule,
  Co2ActionHandler: typeof ActionHandler<COActor, COToken>,
  Co2RollHandler: typeof RollHandler<COActor, COToken>,
  defaults: { layout: Layout[]; groups: Group[] },
): typeof SystemManager<COActor, COToken> {
  return class Co2SystemManager extends coreModule.api.SystemManager<COActor, COToken> {
    /// <inheritdoc />
    override getActionHandler(): ActionHandler<COActor, COToken> {
      const actionHandler = new Co2ActionHandler();
      return actionHandler;
    }

    /// <inheritdoc />
    override getAvailableRollHandlers(): { core: string } {
      const coreTitle = "CO2";
      const choices = { core: coreTitle };
      return choices;
    }

    /// <inheritdoc />
    override getRollHandler(rollHandlerId: string): RollHandler<COActor, COToken> {
      switch (rollHandlerId) {
        case "core":
        default:
          return new Co2RollHandler();
      }
    }

    /// <inheritdoc />
    override async registerDefaults(): Promise<{ layout: Layout[]; groups: Group[] }> {
      return defaults;
    }
  };
}

/**
 * Type representing the return value of createSystemManager (the system manager class).
 */
export type Co2SystemManager = ReturnType<typeof createSystemManager>;
