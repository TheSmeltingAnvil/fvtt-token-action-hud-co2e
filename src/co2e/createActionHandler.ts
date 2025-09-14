import type { Co2Utils } from "./createUtils";
import { buildAbilitiesActions } from "./helpers";

/**
 * Factory function to create a Token Action HUD action handler for the CO2e system.
 * @param coreModule - The Token Action HUD core module instance.
 * @param Utils - Utility class for localization and helpers.
 * @returns A class extending ActionHandler for COActor and COToken.
 */
export default function createActionHandler(coreModule: TokenActionHudCoreModule, Utils: Co2Utils) {
  return class Co2ActionHandler extends coreModule.api.ActionHandler<COActor, COToken> {
    /**
     * Build all system actions for the current actor and add them to the HUD.
     * Only actors of type 'character', 'npc', or 'encounter' are processed.
     */
    override async buildSystemActions(): Promise<void> {
      const actorType = this.actor.type;

      // Exit if actor is not a known type
      const knownActors = ["character", "npc", "encounter"];
      if (actorType && !knownActors.includes(actorType)) return;

      const availableActions = this.#getAvailableActions(actorType);
      console.debug("CO2-TAH Debug | TokenActionHUDCore | Actions:", availableActions);
      for (const { groupId, actions } of availableActions) {
        this.addActions(actions, { id: groupId, type: "system" });
      }
    }

    /**
     * Get all available action groups for the given actor type.
     * @param actorType - The type of actor ('character', 'npc', 'encounter', etc.)
     * @returns Array of group objects, each containing a groupId and actions array.
     */
    #getAvailableActions(actorType: string): {
      groupId: string;
      actions: Action[];
    }[] {
      switch (actorType) {
        case "character":
        case "npc":
          return this.#buildCharacterGroups();
        case "encounter":
          return this.#buildEncounterGroups();
        default:
          return this.#buildTokensGroups();
      }
    }

    // ******************************************************************************** //

    /**
     * Build action groups for 'character' and 'npc' actors.
     * @returns Array with a single group containing ability actions.
     */
    #buildCharacterGroups(): {
      groupId: string;
      actions: Action[];
    }[] {
      return [buildAbilitiesActions(Utils, this.actor)];
    }

    /**
     * Build action groups for 'encounter' actors.
     * @returns Array with a single group containing ability actions.
     */
    #buildEncounterGroups(): {
      groupId: string;
      actions: Action[];
    }[] {
      return [buildAbilitiesActions(Utils, this.actor)];
    }

    /**
     * Build action groups for other token types (not character, npc, or encounter).
     * @returns Empty array (no actions).
     */
    #buildTokensGroups(): {
      groupId: string;
      actions: Action[];
    }[] {
      return [];
    }
  };
}

/**
 * Type representing the return value of createActionHandler (the action handler class).
 */
export type Co2ActionHandler = ReturnType<typeof createActionHandler>;
