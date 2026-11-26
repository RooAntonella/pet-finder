import { getToken } from "../state/session";
import { renderAppHeader, setupAppHeader } from "../components/appHeader";
export function renderPasswordPage() {
  return `
     ${renderAppHeader()}
    <main class="profile-page">
      <h1>Contraseña</h1>

      <form id="password-form">
        <label>
          Contraseña
          <input
            id="new-password"
            type="password"
            required
          />
        </label>

        <label>
          Confirmar contraseña
          <input
            id="confirm-password"
            type="password"
            required
          />
        </label>

        <button type="submit">
          Guardar
        </button>
      </form>

      <p id="password-message"></p>

      <button
        id="back-profile"
        type="button"
      >
        Volver
      </button>
    </main>
  `;
}

export function setupPasswordPage() {
  setupAppHeader();
  const form = document.querySelector<HTMLFormElement>("#password-form")!;

  const passwordInput =
    document.querySelector<HTMLInputElement>("#new-password")!;

  const confirmPasswordInput =
    document.querySelector<HTMLInputElement>("#confirm-password")!;

  const message =
    document.querySelector<HTMLParagraphElement>("#password-message")!;

  const backButton =
    document.querySelector<HTMLButtonElement>("#back-profile")!;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = getToken();

    try {
      message.textContent = "Guardando...";

      const response = await fetch("http://localhost:3000/me/password", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          password: passwordInput.value,
          confirmPassword: confirmPasswordInput.value,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo actualizar la contraseña");
      }

      message.textContent = "Contraseña actualizada correctamente ✅";

      form.reset();
    } catch (error) {
      message.textContent =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la contraseña";
    }
  });

  backButton.addEventListener("click", () => {
    location.hash = "#/profile";
  });
}
