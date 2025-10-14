import type { Co2Utils } from "./createUtils";
import {
  buildAbilitiesActions,
  buildActionsActions,
  buildAttacksActions,
  buildCapacitiesActions,
  buildDefenseActions,
  buildEffectsActions,
  buildInventoryActions,
  buildOffPathCapacitiesActions,
  buildRecoveryActions,
  buildResourcesActions,
} from "./helpers";

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
      const actorType = this.actor?.type;

      // Exit if actor is not a known type
      const knownActors = ["character", "encounter"];
      if (actorType && !knownActors.includes(actorType)) return;

      if (this.actor) this.#prepareCustomPaths();

      const availableActions = await this.#getAvailableActions(actorType);
      console.debug("CO2-TAH Debug | TokenActionHUDCore | Actions:", availableActions);
      for (const { groupId, actions } of availableActions) {
        this.addActions(actions, { id: groupId, type: "system" });
      }
    }

    #prepareCustomPaths() {
      const parent = { id: "paths" };
      for (const path of this.actor.paths) {
        const {
          name,
          system: { slug: id },
        } = path;
        const group: Partial<Group> = { id, name, type: "system" };
        this.addGroup(group, parent);
      }

      this.addGroup(
        {
          id: "capacities",
          nestId: "paths_capacities",
          name: Utils.i18n("CO2.Groups.OffPathCapacities"),
          type: "system",
        },
        parent,
      );
    }

    /**
     * Get all available action groups for the given actor type.
     * @param actorType - The type of actor ('character', 'npc', 'encounter', etc.)
     * @returns Array of group objects, each containing a groupId and actions array.
     */
    async #getAvailableActions(actorType: string): Promise<
      {
        groupId: string;
        actions: Action[];
      }[]
    > {
      switch (actorType) {
        case "character":
          return await this.#buildCharacterGroups();
        case "encounter":
          return await this.#buildEncounterGroups();
        default:
          return this.#buildTokensGroups();
      }
    }

    // ******************************************************************************** //

    /**
     * Build action groups for 'character' and 'npc' actors.
     * @returns Array with a single group containing ability actions.
     */
    async #buildCharacterGroups(): Promise<
      {
        groupId: string;
        actions: Action[];
      }[]
    > {
      return [
        buildAbilitiesActions(Utils, this.actor),
        buildResourcesActions(Utils, this.actor),
        buildRecoveryActions(Utils, this.actor),
        buildDefenseActions(Utils, this.actor),
        await buildActionsActions(Utils, this.actor),
        ...buildInventoryActions(Utils, this.actor),
        ...(await buildCapacitiesActions(Utils, this.actor)),
        await buildOffPathCapacitiesActions(Utils, this.actor),
        ...(await buildEffectsActions(Utils, this.actor)),
      ];
    }

    /**
     * Build action groups for 'encounter' actors.
     * @returns Array with a single group containing ability actions.
     */
    async #buildEncounterGroups(): Promise<
      {
        groupId: string;
        actions: Action[];
      }[]
    > {
      return [
        buildAbilitiesActions(Utils, this.actor),
        buildRecoveryActions(Utils, this.actor),
        buildDefenseActions(Utils, this.actor),
        buildAttacksActions(Utils, this.actor),
        await buildActionsActions(Utils, this.actor),
        await buildOffPathCapacitiesActions(Utils, this.actor),
        ...(await buildEffectsActions(Utils, this.actor)),
      ];
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
