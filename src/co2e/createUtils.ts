import { MODULES } from "../constants";

/**
 * Factory function to create a utility class for the Token Action HUD CO2E system.
 * Provides static methods for getting and setting module settings with logging.
 *
 * @param coreModule - The Token Action HUD core module instance.
 * @returns A class extending the core module's Utils API.
 */
export default function createUtils(coreModule: TokenActionHudCoreModule) {
  return class Co2Utils extends coreModule.api.Utils {
    /**
     * Get a setting value for the CO2E module.
     * @template T
     * @param key - The setting key.
     * @param defaultValue - The default value to return if the setting is not found.
     * @returns The setting value, or the default value if not found.
     */
    static override getSetting<T>(key: string, defaultValue: T | null = null) {
      try {
        return game.settings.get(MODULES.TokenActionHUD.CO2.ID, key) ?? defaultValue ?? null;
      } catch {
        coreModule.api.Logger.debug(`Setting '${key}' not found`);
      }
    }

    /**
     * Set a setting value for the CO2E module.
     * @template T
     * @param key - The setting key.
     * @param value - The value to set.
     * @returns A promise resolving to the set value.
     */
    static override async setSetting<T>(key: string, value: T | null) {
      try {
        value = await game.settings.set(MODULES.TokenActionHUD.CO2.ID, key, value);
        coreModule.api.Logger.debug(`Setting '${key}' set to '${value}'`);
      } catch {
        coreModule.api.Logger.debug(`Setting '${key}' not found`);
      }
    }
  };
}

/**
 * Type representing the return value of createUtils (the utility class).
 */
export type Co2Utils = ReturnType<typeof createUtils>;
