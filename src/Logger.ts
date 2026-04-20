import { MODULES } from "./constants";

export function debug(message: string, ...args: unknown[]): void {
  // Should not be used before the "tokenActionHudReady" hook, but just in case, we will catch any errors here.
  try {
    const debug =
      // @ts-expect-error --IGNORE--
      game.tokenActionHud?.setting?.debug ?? game.settings.get<boolean>(MODULES.TokenActionHUD.Core, "debug");
    if (debug) {
      console.debug("CO2-TAH [Debug] " + message, ...args);
    }
  } catch {
    // ignore
  }
}

export function info(message: string, ...args: unknown[]): void {
  console.info("CO2-TAH [Info ] " + message, ...args);
}

export function error(message: string, ...args: unknown[]): void {
  console.error("CO2-TAH [Error] " + message, ...args);
}
