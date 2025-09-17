import { describe, it, expect } from "vitest";

import { createMockElement, createMockEvent, waitForNextTick } from "../../@/fvtt-testing/src/setup";

describe("DOM testing", () => {
  it("should create mock elements", () => {
    const button = createMockElement("button", {
      "data-action": "test",
      class: "my-button",
    });

    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("data-action")).toBe("test");
  });

  it("should create mock events", () => {
    const clickEvent = createMockEvent("click", { bubbles: true });
    expect(clickEvent.type).toBe("click");
  });

  it("should wait for next tick", async () => {
    let value = 1;
    setTimeout(() => (value = 2), 0);

    await waitForNextTick();
    expect(value).toBe(2);
  });
});

describe("Mon module FoundryVTT", () => {
  it("doit avoir accès à l'instance du jeu", () => {
    expect(game).toBeDefined();
  });

  it("doit avoir accès à l'utilisateur", () => {
    expect(game.user).toBeDefined();
  });

  it("doit avoir accès aux paramètres", () => {
    expect(game.settings).toBeDefined();
  });
});
