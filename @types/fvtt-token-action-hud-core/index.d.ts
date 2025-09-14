export {};
declare global {
  class Hooks {
    static call(hook: "tokenActionHudSystemReady", module: TokenActionHudModule): void;
    static on(hook: "tokenActionHudCoreApiReady", fn: (coreModule: TokenActionHudCoreModule) => void): void;
    static on(hook: "tokenActionHudSystemReady", fn: (module: TokenActionHudModule) => void): void;
    static once(hook: "tokenActionHudCoreApiReady", fn: (coreModule: TokenActionHudCoreModule) => void): void;
    static once(hook: "tokenActionHudSystemReady", fn: (module: TokenActionHudModule) => void): void;
    static off(hook: "tokenActionHudCoreApiReady", fn: (coreModule: TokenActionHudCoreModule) => void): void;
  }

  interface Module extends foundry.packages.Module {
    id: string;
    readonly active: boolean;
    esmodules: Set<string>;
    scripts: Set<string>;
    flags: Record<string, Record<string, unknown>>;
    title: string;
    compatibility: never | foundry.packages.PackageCompatibility; // ModelPropsFromSchema<foundry.packages.PackageCompatibilitySchema>;
  }

  interface TokenActionHudModule extends Module {
    api: TokenActionHudModule.Api;
  }

  namespace TokenActionHudModule {
    interface Api {
      requiredCoreModuleVersion: string;
      SystemManager: { new (): SystemManager };
    }
  }

  interface TokenActionHudCoreModule extends Module {
    api: TokenActionHudCoreModule.Api;
  }

  namespace TokenActionHudCoreModule {
    interface Api {
      actor: AnyActor;
      requiredCoreModuleVersion: string;
      ActionHandler: typeof ActionHandler;
      ActionHandlerExtender: typeof ActionHandlerExtender;
      ActionListExtender: typeof ActionHandlerExtender;
      DataHandler: typeof DataHandler;
      Logger: typeof Logger;
      PreRollHandler: typeof PreRollHandler;
      RollHandler: typeof RollHandler;
      SystemManager: typeof SystemManager;
      Timer: typeof Timer;
      Utils: typeof Utils;
    }
  }

  interface ActionInfo {
    class: string;
    icon: string;
    text: string;
    title: string;
  }
  interface Action<TSystem = any> {
    id: string;
    name: string;
    /** @deprecated Use system instead! */
    encodedValue?: string;
    icon1?: string;
    info1?: Partial<ActionInfo>;
    info2?: Partial<ActionInfo>;
    info3?: Partial<ActionInfo>;
    listName: string;
    cssClass?: string;
    tooltip?: string | { content: string; class: string; direction: "UP"; DOWN; LEFT; RIGHT; CENTER };
    system: TSystem;
    onClick?: (event: MouseEvent) => void | Promise<void>;
    onHover?: (event: MouseEvent) => void | Promise<void>;
  }

  class ActionHandler<
    TActor extends Actor<TokenDocument> = Actor<TokenDocument>,
    TToken extends Token<TokenDocument> = Token<TokenDocument>,
  > {
    get actor(): TActor;
    get actors(): TActor[];
    get token(): TToken;
    get tokens(): TToken[];

    get isRightClick(): boolean;
    get isAlt(): boolean;
    get isCtrl(): boolean;
    get isShift(): boolean;
    get isHover(): boolean;

    delimiter: string;
    hudManager: unknown;
    systemManager: SystemManager<TActor, TToken>;

    addActions(actions: Partial<Action>[], groupData: string | { id: string; type: string });
    buildSystemActions(groupIds: string[]): Promise<void>;
    updateActions(actions: Partial<Action>[], groupData: string | { id: string; type: string });
  }

  class ActionHandlerExtender<
    TActor extends Actor<TokenDocument> = Actor<TokenDocument>,
    TToken extends Token<TokenDocument> = Token<TokenDocument>,
  > {
    extendActionHandler(): void;
  }

  class DataHandler {}

  class Logger {
    static debug(message: string): void;
    static error(message: string | object): void;
  }

  class RollHandler<
    TActor extends Actor<TokenDocument> = Actor<TokenDocument>,
    TToken extends Token<TokenDocument> = Token<TokenDocument>,
  > {
    get actor(): TActor;
    get actors(): TActor[];
    get token(): TToken;
    get tokens(): TToken[];

    action: Action;

    get isRightClick(): boolean;
    get isAlt(): boolean;
    get isCtrl(): boolean;
    get isShift(): boolean;
    get isHover(): boolean;

    delimiter: string;
    hudManager: unknown;

    handleActionClick(
      event: MouseEvent,
      /** @deprecated Will be removed in future versions. */
      encodedValue?: string,
    ): Promise<void> | void;

    handleActionHover(
      event: MouseEvent,
      /** @deprecated Will be removed in future versions. */
      encodedValue?: string,
    ): Promise<void> | void;

    handleGroupClick(event: MouseEvent, group?: unknown): void;

    renderItem(actor: TActor, itemId: string): boolean;

    throwInvalidValueErr(err: unknown): void;
  }

  class PreRollHandler<
    TActor extends Actor<TokenDocument> = Actor<TokenDocument>,
    TToken extends Token<TokenDocument> = Token<TokenDocument>,
  > {
    prehandleActionEvent(
      event: MouseEvent,
      buttonValue?: string,
      actionHandler: typeof ActionHandler<TActor, TToken>,
    ): boolean;
  }

  class RollHandlerExtender<
    TActor extends Actor<TokenDocument> = Actor<TokenDocument>,
    TToken extends Token<TokenDocument> = Token<TokenDocument>,
  > {
    prehandleActionEvent(
      event: MouseEvent,
      buttonValue?: string,
      actionHandler: typeof ActionHandler<TActor, TToken>,
    ): boolean;

    handleActionClick(
      event: MouseEvent,
      buttonValue?: string,
      actionHandler: typeof ActionHandler<TActor, TToken>,
    ): boolean;
  }

  class SystemManager<
    TActor extends Actor<TokenDocument> = Actor<TokenDocument>,
    TToken extends Token<TokenDocument> = Token<TokenDocument>,
  > {
    getActionHandler(): ActionHandler<TActor, TToken>;
    getAvailableRollHandlers(): { core: string };
    getRollHandler(rollHandlerId: string): RollHandler<TActor, TToken> | false | undefined;
    registerSettings(onChangeFunction: (value?: string) => void): void;
    registerDefaults(): Promise<unknown>;
    registerStyles(): { class: string; file: string; moduleId: string; name: string }[];
  }

  class Utils {
    static i18n(key: string): string;
    static getSetting<T>(key: string, defaultValue?: T);
    static setSetting<T>(key: string, value: T): void | Promise<void>;
    static isModuleActive(moduleID: string): boolean;
    static getModuleTitle(moduleID: string): string;
    static getControlledTokens(): Token[];
    static getFirstControlledTokens(): Token;
    static getImage(itemData: any);
    static sortItemsByName<TCollection>(items: TCollection): TCollection;
  }

  interface Layout {
    id: string;
    nestId: string;
    name: string;
    groups: Group[];
    settings?: {
      customWidth?: number;
      grid?: boolean;
      showTitle?: boolean;
      image?: string;
      style?: "tab" | "grid";
    };
  }

  interface Group {
    id: string;
    nestId: string;
    name: string;
    type: string;
    listName?: string;
  }

  interface Defaults {
    layout: Layout[];
    groups: Group[];
  }
}
