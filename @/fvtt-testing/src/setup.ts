import { vi, beforeEach } from "vitest";
import { setupFoundryMocks } from "./mocks";

// Mock jQuery if not already available
if (typeof global.$ === "undefined") {
  global.$ = vi.fn(() => ({
    ready: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    find: vi.fn(() => ({ length: 0 })),
    append: vi.fn(),
    remove: vi.fn(),
    addClass: vi.fn(),
    removeClass: vi.fn(),
    hasClass: vi.fn(() => false),
    attr: vi.fn(),
    prop: vi.fn(),
    val: vi.fn(),
    text: vi.fn(),
    html: vi.fn(),
    css: vi.fn(),
    hide: vi.fn(),
    show: vi.fn(),
    trigger: vi.fn(),
    click: vi.fn(),
    submit: vi.fn(),
  }));
  global.jQuery = global.$;
}

// Setup DOM environment
beforeEach(() => {
  // Clear any existing DOM
  document.body.innerHTML = "";

  // Reset all mocks
  vi.clearAllMocks();

  // Ensure game object is properly reset
  if (global.game) {
    // Reset collections
    Object.keys(game).forEach((key) => {
      // @ts-expect-error - dynamic access
      if (game[key] && typeof game[key] === "object" && game[key].clear) {
        // @ts-expect-error - dynamic access
        game[key].clear();
      }
    });
  }
});

// Common test utilities
export function createMockElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes?: Record<string, string>,
): HTMLElement;
export function createMockElement<K extends keyof HTMLElementDeprecatedTagNameMap>(
  tagName: K,
  attributes?: Record<string, string>,
): HTMLElement;
export function createMockElement(tagName: string, attributes: Record<string, string> = {}): HTMLElement {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

export const createMockEvent = (type: string, options: EventInit | undefined = {}) => {
  return new Event(type, options);
};

export const waitForNextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

setupFoundryMocks();
