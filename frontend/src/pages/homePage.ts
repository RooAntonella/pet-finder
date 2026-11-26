import { getNearbyPets, type Pet } from "../services/petsApi";

import { createReport } from "../services/reportsApi";

import { renderAppHeader, setupAppHeader } from "../components/appHeader";

export function renderHomePage() {
  return `
   
${renderAppHeader()}
    <main class="home">
      <section
        id="home-intro"
        class="home-intro"
      >
        <div class="home-illustration">
          🐶 🐱
        </div>

        <h1>Pet Finder App</h1>

        <p class="home-description">
          Encontrá y reportá mascotas perdidas
          cerca de tu ubicación
        </p>

        <button
          id="use-home-location"
          class="primary-button"
          type="button"
        >
          Dar mi ubicación actual
        </button>

        <button
          id="how-it-works"
          class="secondary-button"
          type="button"
        >
          ¿Cómo funciona Pet Finder?
        </button>

        <p
          id="how-info"
          class="hidden"
        >
          Usamos tu ubicación para mostrarte
          mascotas perdidas cerca tuyo.
          Si viste alguna, podés reportar
          dónde la encontraste.
        </p>

        <p id="home-message"></p>
      </section>

      <section
        id="nearby-section"
        class="hidden"
      >
        <h1>
          Mascotas perdidas cerca
        </h1>

        <p id="status"></p>

        <section id="pets-list"></section>
      </section>
    </main>

    <div
      id="report-modal"
      class="modal hidden"
    >
      <div class="modal__content">
        <button
          id="close-modal"
          class="modal__close"
          type="button"
        >
          ✕
        </button>

        <h2 id="report-title">
          Reportar información
        </h2>

        <form id="report-form">
          <label>
            Nombre
            <input
              type="text"
              id="reporter-name"
              required
            />
          </label>

          <label>
            Teléfono
            <input
              type="tel"
              id="reporter-phone"
              required
            />
          </label>

          <label>
            ¿Dónde lo viste?
            <textarea
              id="report-location"
              required
            ></textarea>
          </label>

          <button type="submit">
            Enviar información
          </button>
        </form>

        <p id="report-message"></p>
    </div>
  `;
}

export function setupHomePage() {
  setupAppHeader();

  const intro = document.querySelector<HTMLElement>("#home-intro")!;

  const nearbySection = document.querySelector<HTMLElement>("#nearby-section")!;

  const locationButton =
    document.querySelector<HTMLButtonElement>("#use-home-location")!;

  const howButton = document.querySelector<HTMLButtonElement>("#how-it-works")!;

  const howInfo = document.querySelector<HTMLParagraphElement>("#how-info")!;

  const homeMessage =
    document.querySelector<HTMLParagraphElement>("#home-message")!;

  const statusElement =
    document.querySelector<HTMLParagraphElement>("#status")!;

  const modal = document.querySelector<HTMLDivElement>("#report-modal")!;

  const reportTitle =
    document.querySelector<HTMLHeadingElement>("#report-title")!;

  const reportForm = document.querySelector<HTMLFormElement>("#report-form")!;

  const closeModalButton =
    document.querySelector<HTMLButtonElement>("#close-modal")!;

  const reportMessage =
    document.querySelector<HTMLParagraphElement>("#report-message")!;

  if (
    !intro ||
    !nearbySection ||
    !locationButton ||
    !howButton ||
    !howInfo ||
    !homeMessage ||
    !statusElement ||
    !modal ||
    !reportTitle ||
    !reportForm ||
    !closeModalButton ||
    !reportMessage
  ) {
    return;
  }

  let selectedPetId: number | null = null;

  function openReportModal(petId: number, petName: string) {
    selectedPetId = petId;

    reportTitle.textContent = `Reportar info de ${petName}`;

    reportMessage.textContent = "";

    modal.classList.remove("hidden");
  }

  function closeReportModal() {
    selectedPetId = null;

    reportForm.reset();

    modal.classList.add("hidden");
  }

  function renderPets(pets: Pet[]) {
    const petsList = document.querySelector<HTMLElement>("#pets-list")!;

    if (!petsList) {
      return;
    }

    if (pets.length === 0) {
      petsList.innerHTML = `
        <p>
          No encontramos mascotas perdidas
          cerca tuyo.
        </p>
      `;

      return;
    }

    petsList.innerHTML = pets
      .map(
        (pet) => `
          <article class="pet-card">
            <img
              src="${pet.imageUrl}"
              alt="${pet.name}"
              class="pet-card__image"
            />

            <div class="pet-card__content">
              <h2>${pet.name}</h2>

              <p>${pet.location}</p>

              <button
                class="report-button"
                data-pet-id="${pet.id}"
                data-pet-name="${pet.name}"
                type="button"
              >
                Reportar
              </button>
            </div>
          </article>
        `,
      )
      .join("");

    const reportButtons =
      document.querySelectorAll<HTMLButtonElement>(".report-button");

    reportButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const petId = Number(button.dataset.petId);

        const petName = button.dataset.petName || "mascota";

        openReportModal(petId, petName);
      });
    });
  }

  howButton.addEventListener("click", () => {
    howInfo.classList.toggle("hidden");
  });

  locationButton.addEventListener("click", () => {
    homeMessage.textContent = "Obteniendo ubicación...";

    locationButton.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;

          const lng = position.coords.longitude;

          const pets = await getNearbyPets(lat, lng);

          renderPets(pets);

          intro.classList.add("hidden");

          nearbySection.classList.remove("hidden");

          statusElement.textContent = "Mascotas perdidas cerca tuyo";
        } catch (error) {
          homeMessage.textContent =
            error instanceof Error
              ? error.message
              : "No pudimos cargar las mascotas.";

          locationButton.disabled = false;
        }
      },

      () => {
        homeMessage.textContent = "No pudimos obtener tu ubicación.";

        locationButton.disabled = false;
      },
    );
  });

  closeModalButton.addEventListener("click", closeReportModal);

  reportForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (selectedPetId === null) {
      return;
    }

    const reporterName =
      document.querySelector<HTMLInputElement>("#reporter-name")?.value;

    const reporterPhone =
      document.querySelector<HTMLInputElement>("#reporter-phone")?.value;

    const location =
      document.querySelector<HTMLTextAreaElement>("#report-location")?.value;

    if (!reporterName || !reporterPhone || !location) {
      return;
    }

    try {
      reportMessage.textContent = "Enviando información...";

      await createReport(selectedPetId, {
        reporterName,
        reporterPhone,
        location,
      });

      reportMessage.textContent = "Información enviada correctamente ✅";

      reportForm.reset();
    } catch (error) {
      reportMessage.textContent =
        error instanceof Error
          ? error.message
          : "No se pudo enviar la información";
    }
  });
}
