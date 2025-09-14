import { createActionHandler, createDefaults, createRollHandler, createSystemManager, createUtils } from "../co2e";
import { MODULES, REQUIRED_CORE_MODULE_VERSION } from "../constants";

export const tokenActionHudCoreApiReady = {
  listen: function () {
    let Co2SystemManager: typeof SystemManager;

    Hooks.once("tokenActionHudCoreApiReady", (coreModule: TokenActionHudCoreModule): void => {
      console.debug("CO2-TAH Debug | TokenActionHUDCore | Initialize types.");
      const Co2Utils = createUtils(coreModule);
      const defaults = createDefaults(Co2Utils);
      Co2SystemManager = createSystemManager(
        coreModule,
        createActionHandler(coreModule, Co2Utils),
        createRollHandler(coreModule),
        defaults,
      ) as typeof SystemManager;
    });

    Hooks.once("tokenActionHudCoreApiReady", (): void => {
      console.debug("CO2-TAH Debug | TokenActionHUDCore | Initialize module.");
      // @ts-expect-error 'TokenActionHudModule | undefined' is not assignable to type 'Module'
      const module = game.modules.get<TokenActionHudModule>(MODULES.TokenActionHUD.CO2.ID);
      module.api = {
        requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
        SystemManager: Co2SystemManager,
      };
      Hooks.call("tokenActionHudSystemReady", module);
    });

    Hooks.once("tokenActionHudSystemReady", (): void => {
      console.info("CO2-TAH Debug | TokenActionHUDCore | Ready.");
    });
  },
};
