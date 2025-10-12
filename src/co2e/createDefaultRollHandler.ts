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
      console.debug("CO2-TAH Debug | handle action", actionType, actionId);
      const action = this.#getAction(actionType, actionId);
      if (action) await action();
    }

    #getAction(actionType: string, actionId: string): () => Promise<void> {
      switch ([this.isRightClick, this.isShift, this.isCtrl].join(",")) {
        case "false,false,false":
          // left-click (execute primary action or macro if any)
          return async () => {
            await this.#executePrimaryAction(actionType, actionId);
          };

        case "false,true,false":
          // left-click (execute primary action or macro if any)
          return async () => {
            await this.#executeAlternatePrimaryAction(actionType, actionId);
          };

        case "true,false,false":
          // right-click (send to chat if any)
          return async () => {
            await this.#sendToChat(actionType, actionId);
          };

        case "true,true,false":
          // right-click (show sheet if any)
          return async () => {
            await this.#showItem(actionType, actionId);
          };

        default:
          return () => Promise.resolve();
      }
    }

    /** Execute primary action (left-click) */
    async #executePrimaryAction(actionType: string, actionId: string) {
      switch (actionType) {
        case "rollAbility":
          return await this.actor.rollSkill(actionId, { withDialog: true });
        case "rollFortune":
          return await this.actor.system.rollFortune();
        case "useRecovery":
          return await this.actor.system.useRecovery(actionId === "full");
        case "useDefense":
          return await (async () => {
            const effect = actionId as "fullDef" | "partialDef";
            const hasFullDef = this.actor.hasEffect("fullDef");
            const hasPartialDef = this.actor.hasEffect("partialDef");
            // Adapted from COBaseActorSheet._handleDef() in CO2
            // Prevent activating both defenses at the same time
            if (effect === "fullDef" && !hasFullDef && hasPartialDef)
              await this.actor.toggleStatusEffect("partialDef", { active: false });
            if (effect === "partialDef" && !hasPartialDef && hasFullDef)
              await this.actor.toggleStatusEffect("fullDef", { active: false });
            return await this.actor.toggleStatusEffect(effect);
          })();
        case "useAttack":
          return await (async () => {
            // @ts-expect-error --IGNORE--
            const item = (await fromUuid(actionId, { relative: this.actor })) as COItem | null;
            if (!item) return;
            return await this.#toggleActionOrEffect(item, 0);
          })();
        case "useAction":
          return await (async () => {
            const [sourceUuid, indice] = actionId.split(":");
            if (!sourceUuid || !indice) return;
            //@ts-expect-error --IGNORE--
            const source = (await fromUuid(sourceUuid, { relative: this.actor })) as COItem | null;
            if (!source) return;
            return await this.#toggleActionOrEffect(source, Number(indice));
          })();
        case "toggleEquipmentOrUseConsumable":
          return (async () => {
            //@ts-expect-error --IGNORE--
            const item = (await fromUuid(actionId, { relative: this.actor })) as COItem | null;
            if (!item) return;
            if (item.system.isConsumable) {
              const resolvers = item.actions.flatMap((action) =>
                action.resolvers.filter((resolver) => resolver.type === "consumable"),
              );
              return resolvers.forEach((resolver) => resolver.consume(this.actor, item));
            }
            return await this.actor.toggleEquipmentEquipped(item.id);
          })();
        case "useCapacity":
          return (async () => {
            //@ts-expect-error --IGNORE--
            const capacity = (await fromUuid(actionId, { relative: this.actor })) as COCapacity | null;
            if (!capacity) return;
            return await this.#toggleActionOrEffect(capacity, 0);
          })();
        case "toggleEffect":
          return await (async () => {
            const [sourceUuid, indice] = actionId.split(":");
            if (!sourceUuid || !indice) return;
            //@ts-expect-error --IGNORE--
            const source = (await fromUuid(sourceUuid, { relative: this.actor })) as COItem | null;
            if (!source) return;
            return await this.#toggleActionOrEffect(source, Number(indice));
          })();
        default:
          return () => Promise.resolve();
      }
    }

    /** Execute alternate primary action (SHIFT + left-click) */
    async #executeAlternatePrimaryAction(actionType: string, actionId: string) {
      switch (actionType) {
        case "rollAbility":
          return await this.actor.rollSkill(actionId, { withDialog: false });
        case "useAttack":
          return (async () => {
            // @ts-expect-error --IGNORE--
            const item = (await fromUuid(actionId, { relative: this.actor })) as COItem | null;
            if (!item) return;
            // @ts-expect-error --IGNORE--
            return this.actor.rollAttack(item, { withDialog: false, skillFormula: "" });
          })();
        case "useAction":
          return (async () => {
            const [sourceUuid, indice] = actionId.split(":");
            //@ts-expect-error --IGNORE--
            const source = (await fromUuid(sourceUuid, { relative: this.actor })) as COItem | null;
            if (!source) return;
            return await this.#toggleActionOrEffect(source, Number(indice));
          })();
        default:
          return () => Promise.resolve();
      }
    }

    /** Send to chat action (right-click) */
    async #sendToChat(actionType: string, actionId: string) {
      switch (actionType) {
        default:
          return await (async () => {
            const [source, indice] =
              actionId.indexOf(":") === -1 ? [actionId, null] : (actionId.split(":") ?? [undefined, null]);
            // @ts-expect-error --IGNORE--
            const item = (await fromUuid(source, { relative: this.actor })) as COItem | null;
            // @ts-expect-error --IGNORE--
            return game.system.api.macros.sendToChat(source, item.name, indice);
          })();
      }
    }

    /** Show sheet action (SHIFT + right-click) */
    async #showItem(actionType: string, actionId: string) {
      switch (actionType) {
        default:
          return await (async () => {
            const [source, _indice] =
              actionId.indexOf(":") === -1 ? [actionId, null] : (actionId.split(":") ?? [undefined, null]);
            // @ts-expect-error --IGNORE--
            const item = (await fromUuid(source, { relative: this.actor })) as COItem | null;
            if (item) item.sheet?.render(true);
          })();
      }
    }

    async #toggleActionOrEffect(source: COItem | COCapacity, indice: number) {
      const state = !source.actions[indice]?.properties.enabled;
      return await this.actor.activateAction({ state, source: source.uuid, indice });
    }
  };
}

export type Co2DefaultRollHandler = ReturnType<typeof createDefaultRollHandler>;
