import { getMyProfile, updateMyProfile } from "../services/profileApi";
import { renderAppHeader, setupAppHeader } from "../components/appHeader";
export function renderPersonalDataPage() {
  return `
     ${renderAppHeader()}
    <main class="profile-page">
      <h1>Datos personales</h1>

      <form id="profile-form">
        <label>
          Nombre
          <input
            id="profile-name"
            type="text"
          />
        </label>

        <label>
          Localidad
          <input
            id="profile-location"
            type="text"
          />
        </label>

        <button type="submit">
          Guardar
        </button>
      </form>

      <p id="profile-message"></p>

      <button
        id="back-profile"
        type="button"
      >
        Volver
      </button>
    </main>
  `;
}

export async function setupPersonalDataPage() {
  setupAppHeader();
  const form = document.querySelector<HTMLFormElement>("#profile-form")!;

  const nameInput = document.querySelector<HTMLInputElement>("#profile-name")!;

  const locationInput =
    document.querySelector<HTMLInputElement>("#profile-location")!;

  const message =
    document.querySelector<HTMLParagraphElement>("#profile-message")!;

  const backButton =
    document.querySelector<HTMLButtonElement>("#back-profile")!;

  try {
    const profile = await getMyProfile();

    nameInput.value = profile.name || "";

    locationInput.value = profile.location || "";
  } catch (error) {
    message.textContent =
      error instanceof Error
        ? error.message
        : "No se pudieron cargar tus datos";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      message.textContent = "Guardando...";

      await updateMyProfile({
        name: nameInput.value,
        location: locationInput.value,
      });

      message.textContent = "Datos actualizados correctamente ✅";
    } catch (error) {
      message.textContent =
        error instanceof Error
          ? error.message
          : "No se pudieron actualizar tus datos";
    }
  });

  backButton.addEventListener("click", () => {
    location.hash = "#/profile";
  });
}
