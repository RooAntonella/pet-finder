import { renderAppHeader, setupAppHeader } from "../components/appHeader";

export function renderProfilePage() {
  return `
   ${renderAppHeader()}
    <main class="profile-page">
      <h1>Mis datos</h1>

      <div class="profile-options">
        <button
          id="go-personal-data"
          type="button"
        >
          Modificar datos personales
        </button>

        <button
          id="go-password"
          type="button"
        >
          Modificar contraseña
        </button>
      </div>

      <button
        id="back-menu"
        type="button"
      >
        Volver
      </button>
    </main>
  `;
}

export function setupProfilePage() {
  setupAppHeader();
  const personalDataButton =
    document.querySelector<HTMLButtonElement>("#go-personal-data");

  const passwordButton =
    document.querySelector<HTMLButtonElement>("#go-password");

  const backButton = document.querySelector<HTMLButtonElement>("#back-menu");

  personalDataButton?.addEventListener("click", () => {
    location.hash = "#/profile/data";
  });

  passwordButton?.addEventListener("click", () => {
    location.hash = "#/profile/password";
  });

  backButton?.addEventListener("click", () => {
    location.hash = "#/";
  });
}
