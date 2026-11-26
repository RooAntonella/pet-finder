import {
  deletePet,
  getPetById,
  markPetAsFound,
  updatePet,
} from "../services/petsApi";

import { renderAppHeader, setupAppHeader } from "../components/appHeader";

import { renderLocationMap, setupLocationMap } from "../components/locationMap";

export function renderEditPetPage() {
  return `
    ${renderAppHeader()}

    <main class="edit-pet-page">

      <h1>Editar mascota perdida</h1>

      <form id="edit-pet-form">

        <label>
          Nombre
          <input
            id="edit-pet-name"
            type="text"
            required
          />
        </label>

        <div>
          <p>Foto actual</p>

          <img
            id="edit-pet-image"
            class="pet-card__image"
            alt="Foto de la mascota"
          />
        </div>

        <label>
          Cambiar foto
          <input
            id="edit-pet-file"
            type="file"
            accept="image/*"
          />
        </label>

        <div class="location-section">

          ${renderLocationMap()}

          <p class="location-help">
            Podés modificar la ubicación seleccionando
            otro punto en el mapa.
          </p>

          <button
            id="use-current-location"
            class="location-button"
            type="button"
          >
            Usar mi ubicación actual
          </button>

          <p id="edit-location-message"></p>

          <label>
            Ubicación
            <input
              id="edit-pet-location"
              type="text"
              required
            />
          </label>

        </div>

        <button type="submit">
          Guardar
        </button>

      </form>

      <p id="edit-pet-message"></p>

      <button
        id="mark-found"
        type="button"
      >
        Reportar como encontrado
      </button>

      <button
        id="delete-pet"
        type="button"
      >
        Eliminar reporte
      </button>

      <button
        id="back-my-pets"
        type="button"
      >
        Volver
      </button>

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

export async function setupEditPetPage(petId: number) {
  setupAppHeader();

  const form = document.querySelector<HTMLFormElement>("#edit-pet-form")!;

  const nameInput = document.querySelector<HTMLInputElement>("#edit-pet-name")!;

  const locationInput =
    document.querySelector<HTMLInputElement>("#edit-pet-location")!;

  const fileInput = document.querySelector<HTMLInputElement>("#edit-pet-file")!;

  const image = document.querySelector<HTMLImageElement>("#edit-pet-image")!;

  const message =
    document.querySelector<HTMLParagraphElement>("#edit-pet-message")!;

  const locationMessage = document.querySelector<HTMLParagraphElement>(
    "#edit-location-message",
  )!;

  const locationButton = document.querySelector<HTMLButtonElement>(
    "#use-current-location",
  )!;

  const foundButton = document.querySelector<HTMLButtonElement>("#mark-found")!;

  const deleteButton =
    document.querySelector<HTMLButtonElement>("#delete-pet")!;

  const backButton =
    document.querySelector<HTMLButtonElement>("#back-my-pets")!;

  let lat: number;
  let lng: number;

  let pageActive = true;

  let locationMap: ReturnType<typeof setupLocationMap> | undefined;

  // Liberar el mapa al cambiar de pantalla

  window.addEventListener(
    "hashchange",
    () => {
      pageActive = false;
      locationMap?.destroy();
    },
    { once: true },
  );

  // Botón Volver

  backButton.addEventListener("click", () => {
    location.hash = "#/my-pets";
  });

  // Cargar los datos de la mascota

  try {
    const pet = await getPetById(petId);

    if (!pageActive) {
      return;
    }

    nameInput.value = pet.name;
    locationInput.value = pet.location;

    image.src = pet.imageUrl;

    lat = pet.lat;
    lng = pet.lng;

    // Inicializar el mapa con la ubicación guardada

    locationMap = setupLocationMap(
      (selectedLat, selectedLng) => {
        lat = selectedLat;
        lng = selectedLng;

        locationMessage.textContent = "Ubicación seleccionada correctamente ✅";
      },
      {
        lat: pet.lat,
        lng: pet.lng,
      },
    );
  } catch (error) {
    message.textContent =
      error instanceof Error ? error.message : "No se pudo cargar la mascota";

    return;
  }

  // Vista previa de la nueva foto

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];

    if (!file) {
      return;
    }

    try {
      const imageData = await fileToDataUrl(file);

      image.src = imageData;
    } catch (error) {
      message.textContent = "No se pudo cargar la imagen";
    }
  });

  // Obtener ubicación actual

  locationButton.addEventListener("click", () => {
    locationMessage.textContent = "Buscando ubicación...";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!pageActive) {
          return;
        }

        locationMap?.setLocation(
          position.coords.latitude,
          position.coords.longitude,
        );
      },

      () => {
        if (!pageActive) {
          return;
        }

        locationMessage.textContent = "No pudimos obtener tu ubicación";
      },
    );
  });

  // Guardar los cambios

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      message.textContent = "Guardando...";

      const file = fileInput.files?.[0];

      let imageData: string | undefined;

      if (file) {
        imageData = await fileToDataUrl(file);
      }

      const pet = await updatePet(petId, {
        name: nameInput.value,
        location: locationInput.value,
        lat,
        lng,
        imageData,
      });

      image.src = pet.imageUrl;

      fileInput.value = "";

      message.textContent = "Mascota actualizada correctamente ✅";
    } catch (error) {
      message.textContent =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la mascota";
    }
  });

  // Marcar mascota como encontrada

  foundButton.addEventListener("click", async () => {
    const confirmed = window.confirm(
      "¿Confirmás que esta mascota fue encontrada?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await markPetAsFound(petId);

      location.hash = "#/my-pets";
    } catch (error) {
      message.textContent =
        error instanceof Error
          ? error.message
          : "No se pudo marcar como encontrada";
    }
  });

  // Eliminar reporte

  deleteButton.addEventListener("click", async () => {
    const confirmed = window.confirm(
      "¿Seguro que querés eliminar este reporte?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePet(petId);

      location.hash = "#/my-pets";
    } catch (error) {
      message.textContent =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el reporte";
    }
  });
}
