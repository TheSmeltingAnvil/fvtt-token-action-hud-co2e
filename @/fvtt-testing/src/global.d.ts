export {};
declare global {
  namespace globalThis {
    const ui: FoundryUI;
    const canvas: foundry.canvas.Canvas;
    const game: foundry.Game;
    const Hooks: foundry.helpers.Hooks;
    const CONFIG: foundry.Config;

    const $: JQueryStatic;
    const jQuery: JQueryStatic;
  }

  interface FoundryUI {
    actors: typeof ActorDirectory;
    cards: typeof CardsDirectory;
    chat: typeof ChatLog;
    combat: typeof CombatTracker;
    compendium: typeof CompendiumDirectory;
    controls: typeof SceneControls;
    hotbar: typeof Hotbar;
    items: typeof ItemDirectory;
    journal: typeof JournalDirectory;
    macros: typeof MacroDirectory;
    menu: typeof MainMenu;
    nav: typeof SceneNavigation;
    notifications: typeof Notifications;
    pause: typeof GamePause;
    players: typeof Players;
    playlists: typeof PlaylistDirectory;
    scenes: typeof SceneDirectory;
    settings: typeof Settings;
    sidebar: typeof Sidebar;
    tables: typeof RollTableDirectory;
    webrtc: typeof CameraViews;
  }
}
