/**
 * Factory function to create a Token Action HUD roll handler for the CO2E system.
 * @param coreModule - The Token Action HUD core module instance.
 * @returns A class extending RollHandler for COActor and COToken.
 */
export default function createDefaultRollHandler(coreModule: TokenActionHudCoreModule) {
  return class Co2RollHandler extends coreModule.api.RollHandler<COActor, COToken> {
    /**
     * Handle action click event for the HUD.
     * @override
     * @param _event - The mouse event triggering the action.
     * @param _encodedValue - Encoded value containing action details.
     */
    override async handleActionClick(_event: MouseEvent, _encodedValue: string) {
      const { actionType, actionId } = this.action.system;
      if (this.actor) {
        return await this.#handleAction(this.actor, actionType, actionId);
      }

      for (const token of this.tokens) {
        const actor = token.actor;
        if (actor) await this.#handleAction(actor, actionType, actionId);
      }
    }

    /**
     * Handle a specific action for an actor and token.
     * @private
     * @param actor - The actor performing the action.
     * @param actionType - The type of action to perform.
     * @param actionId - The identifier for the action.
     */
    async #handleAction(actor: COActor, actionType: string, actionId: string) {
      console.debug("COF-TAH Debug | handle action", actionType, actionId);
      const action = this.#getAction(actionType, actionId);
      if (action) await action();
    }

    #getAction(actionType: string, actionId: string): (() => Promise<void>) | undefined {
      switch ([this.isRightClick, this.isShift, this.isCtrl].join(",")) {
        case "false,false,false":
          // left-click (execute primary action or macro if any)
          return () => this.#executePrimaryAction(actionType, actionId);

        case "false,true,false":
          // left-click (execute primary action or macro if any)
          return () => this.#executeAlternatePrimaryAction(actionType, actionId);

        default:
          return undefined;
      }
    }

    /** Execute primary action (left-click) */
    async #executePrimaryAction(actionType: string, actionId: string) {
      switch (actionType) {
        case "rollAbility":
          return await this.actor.rollSkill(actionId, { withDialog: true });
      }
    }

    /** Execute alternate primary action (SHIFT + left-click) */
    async #executeAlternatePrimaryAction(actionType: string, actionId: string) {
      switch (actionType) {
        case "rollAbility":
          return await this.actor.rollSkill(actionId, { withDialog: false });
      }
    }
  };
}

export type Co2DefaultRollHandler = ReturnType<typeof createDefaultRollHandler>;
