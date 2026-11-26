import { createPet } from "../services/petsApi";

import { renderAppHeader, setupAppHeader } from "../components/appHeader";

import { renderLocationMap, setupLocationMap } from "../components/locationMap";

export function renderReportPetPage() {
  return `
    ${renderAppHeader()}

    <main class="report-pet-page">

      <h1>Reportar mascota</h1>

      <p class="report-pet-subtitle">
        Ingresá la siguiente información para
        realizar el reporte de la mascota
      </p>

      <form id="report-pet-form">

        <label>
          Nombre
          <input
            id="pet-name"
            type="text"
            required
          />
        </label>

        <div class="photo-section">

          <div class="photo-preview-box">
            <span
              id="photo-placeholder"
              class="photo-placeholder"
            >
              🖼️
            </span>

            <img
              id="pet-preview"
              class="pet-preview hidden"
              alt="Vista previa de la mascota"
            />
          </div>

          <label
            for="pet-image"
            class="photo-button"
          >
            Agregar foto
          </label>

          <input
            id="pet-image"
            class="file-input-hidden"
            type="file"
            accept="image/*"
            required
          />

        </div>

        <div class="location-section">

          ${renderLocationMap()}

          <p class="location-help">
            Seleccioná en el mapa un punto de referencia
            donde viste a tu mascota por última vez.
          </p>

          <button
            id="use-location"
            type="button"
            class="location-button"
          >
            Usar mi ubicación actual
          </button>

          <p id="location-message"></p>

          <label>
            Ubicación
            <input
              id="pet-location"
              type="text"
              placeholder="Ej: Palermo, Buenos Aires"
              required
            />
          </label>

        </div>

        <button
          type="submit"
          class="report-pet-submit"
        >
          Reportar mascota
        </button>

        <button
          id="cancel-report"
          type="button"
          class="report-pet-cancel"
        >
          Cancelar
        </button>

      </form>

      <p id="report-pet-message"></p>

    </main>
  `;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result));
    };

    reader.onerror = () => {
      reject(new Error("No se pudo leer la imagen"));
    };

    reader.readAsDataURL(file);
  });
}

export function setupReportPetPage() {
  setupAppHeader();

  const form = document.querySelector<HTMLFormElement>("#report-pet-form")!;

  const nameInput = document.querySelector<HTMLInputElement>("#pet-name")!;

  const imageInput = document.querySelector<HTMLInputElement>("#pet-image")!;

  const preview = document.querySelector<HTMLImageElement>("#pet-preview")!;

  const locationInput =
    document.querySelector<HTMLInputElement>("#pet-location")!;

  const locationButton =
    document.querySelector<HTMLButtonElement>("#use-location")!;

  const locationMessage =
    document.querySelector<HTMLParagraphElement>("#location-message")!;

  const message = document.querySelector<HTMLParagraphElement>(
    "#report-pet-message",
  )!;

  const cancelButton =
    document.querySelector<HTMLButtonElement>("#cancel-report")!;

  let lat: number | undefined;
  let lng: number | undefined;

  // Inicializar mapa interactivo

  const locationMap = setupLocationMap((selectedLat, selectedLng) => {
    lat = selectedLat;
    lng = selectedLng;

    locationMessage.textContent = "Ubicación seleccionada correctamente ✅";
  });

  // Liberar el mapa al cambiar de pantalla

  let pageActive = true;

  window.addEventListener(
    "hashchange",
    () => {
      pageActive = false;
      locationMap.destroy();
    },
    { once: true },
  );

  // Vista previa de la imagen

  imageInput.addEventListener("change", async () => {
    const file = imageInput.files?.[0];

    if (!file) {
      return;
    }

    const imageData = await fileToDataUrl(file);

    preview.src = imageData;
    preview.classList.remove("hidden");

    const placeholder =
      document.querySelector<HTMLElement>("#photo-placeholder");

    placeholder?.classList.add("hidden");
  });

  // Obtener ubicación actual

  locationButton.addEventListener("click", () => {
    locationMessage.textContent = "Buscando ubicación...";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!pageActive) {
          return;
        }

        locationMap.setLocation(
          position.coords.latitude,
          position.coords.longitude,
        );
      },

      () => {
        if (!pageActive) {
          return;
        }

        locationMessage.textContent = "No pudimos obtener tu ubicación.";
      },
    );
  });

  // Publicar mascota

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = imageInput.files?.[0];

    if (!file) {
      message.textContent = "Tenés que seleccionar una foto.";

      return;
    }

    if (lat === undefined || lng === undefined) {
      message.textContent = "Tenés que indicar la ubicación de la mascota.";

      return;
    }

    try {
      message.textContent = "Publicando reporte...";

      const imageData = await fileToDataUrl(file);

      await createPet({
        name: nameInput.value,
        imageData,
        location: locationInput.value,
        lat,
        lng,
      });

      location.hash = "#/my-pets";
    } catch (error) {
      message.textContent =
        error instanceof Error
          ? error.message
          : "No se pudo publicar la mascota";
    }
  });

  // Cancelar reporte

  cancelButton.addEventListener("click", () => {
    location.hash = "#/";
  });
}
