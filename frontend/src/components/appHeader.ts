import { renderMenuDrawer, setupMenuDrawer } from "./menuDrawer";

export function renderAppHeader() {
  return `
    <header class="app-header">
      <div class="app-logo">
        🐾
      </div>

      <button
        id="open-menu"
        class="menu-button"
        type="button"
        aria-label="Abrir menú"
      >
        ☰
      </button>
    </header>

    ${renderMenuDrawer()}
  `;
}

export function setupAppHeader() {
  setupMenuDrawer();
}
