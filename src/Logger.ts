export function debug(message: string, ...args: unknown[]): void {
  // @ts-expect-error --IGNORE--
  const debug = game.tokenActionHud?.setting?.debug ?? game.settings.get<boolean>("token-action-hud", "debug");
  if (debug) {
    console.debug("CO2-TAH Debug | TokenActionHUDCore | " + message, ...args);
  }
}

export function error(message: string, ...args: unknown[]): void {
  console.error("CO2-TAH Error | TokenActionHUDCore | " + message, ...args);
}
