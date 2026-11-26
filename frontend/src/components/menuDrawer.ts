import { isLoggedIn, removeToken } from "../state/session";

import { getMyProfile } from "../services/profileApi";

export function renderMenuDrawer(): string {
  return `
    <div
      id="menu-overlay"
      class="menu-overlay hidden"
    >
      <aside class="menu-drawer">

        <button
          id="close-menu"
          class="menu-close"
          type="button"
        >
          ✕
        </button>

        <nav class="drawer-options">

<button id="go-home" type="button">
  Inicio
</button>

          <button
            id="drawer-profile"
            type="button"
          >
            Mis datos
          </button>

          <button
            id="drawer-my-pets"
            type="button"
          >
            Mis mascotas reportadas
          </button>

          <button
            id="drawer-report-pet"
            type="button"
          >
            Reportar mascota
          </button>

        </nav>

        <div class="drawer-session">

          <p id="drawer-email"></p>

          <button
            id="drawer-login"
            type="button"
          >
            Ingresar
          </button>

          <button
            id="drawer-logout"
            type="button"
          >
            Cerrar sesión
          </button>

        </div>

      </aside>
    </div>
  `;
}

export async function setupMenuDrawer() {
  const homeButton = document.querySelector<HTMLButtonElement>("#go-home")!;

  homeButton.addEventListener("click", () => {
    location.hash = "#/";
  });
  const openButton = document.querySelector<HTMLButtonElement>("#open-menu")!;

  const overlay = document.querySelector<HTMLDivElement>("#menu-overlay")!;

  const closeButton = document.querySelector<HTMLButtonElement>("#close-menu")!;

  const profileButton =
    document.querySelector<HTMLButtonElement>("#drawer-profile")!;

  const myPetsButton =
    document.querySelector<HTMLButtonElement>("#drawer-my-pets")!;

  const reportPetButton =
    document.querySelector<HTMLButtonElement>("#drawer-report-pet")!;

  const emailElement =
    document.querySelector<HTMLParagraphElement>("#drawer-email")!;

  const loginButton =
    document.querySelector<HTMLButtonElement>("#drawer-login")!;

  const logoutButton =
    document.querySelector<HTMLButtonElement>("#drawer-logout")!;

  function closeMenu() {
    overlay.classList.add("hidden");
  }

  openButton.addEventListener("click", () => {
    overlay.classList.remove("hidden");
  });

  closeButton.addEventListener("click", closeMenu);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeMenu();
    }
  });

  profileButton.addEventListener("click", () => {
    if (!isLoggedIn()) {
      location.hash = "#/login";
      return;
    }

    location.hash = "#/profile";
  });

  myPetsButton.addEventListener("click", () => {
    if (!isLoggedIn()) {
      location.hash = "#/login";
      return;
    }

    location.hash = "#/my-pets";
  });

  reportPetButton.addEventListener("click", () => {
    if (!isLoggedIn()) {
      location.hash = "#/login";
      return;
    }

    location.hash = "#/report-pet";
  });

  if (isLoggedIn()) {
    loginButton.classList.add("hidden");
    logoutButton.classList.remove("hidden");

    try {
      const profile = await getMyProfile();

      emailElement.textContent = profile.email;
    } catch {
      emailElement.textContent = "";
    }
  } else {
    loginButton.classList.remove("hidden");
    logoutButton.classList.add("hidden");

    emailElement.textContent = "";
  }

  loginButton.addEventListener("click", () => {
    location.hash = "#/login";
  });

  logoutButton.addEventListener("click", () => {
    removeToken();

    closeMenu();

    location.hash = "#/";
  });
}
