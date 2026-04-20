import { createActionHandler, createDefaults, createRollHandler, createSystemManager, createUtils } from "../co2e";
import { MODULES, REQUIRED_CORE_MODULE_VERSION } from "../constants";
import * as Logger from "../Logger";

export const tokenActionHudCoreReady = {
  listen: function () {
    Hooks.once("tokenActionHudCoreApiReady", (coreModule: TokenActionHudCoreModule): void => {
      Logger.info("Initializing...");
      const Co2Utils = createUtils(coreModule);
      const defaults = createDefaults(Co2Utils);
      const Co2SystemManager = createSystemManager(
        coreModule,
        createActionHandler(coreModule, Co2Utils),
        createRollHandler(coreModule),
        defaults,
      ) as typeof SystemManager;
      // @ts-expect-error --IGNORE--
      const module = game.modules.get<TokenActionHudModule>(MODULES.TokenActionHUD.CO2.ID);
      module.api = {
        requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
        SystemManager: Co2SystemManager,
      };
      Hooks.call("tokenActionHudSystemReady", module);
    });

    Hooks.once("tokenActionHudReady", () => {
      Logger.info("Ready.");
      Logger.debug("Debug is enabled.");
    });
  },
};
