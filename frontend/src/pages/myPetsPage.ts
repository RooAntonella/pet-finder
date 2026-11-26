import { getMyPets, type Pet } from "../services/petsApi";

import { renderAppHeader, setupAppHeader } from "../components/appHeader";

import emptyReportsImage from "../assets/empty-reports.png";

export function renderMyPetsPage() {
  return `
        ${renderAppHeader()}

        <main class="my-pets-page">
            <h1>Mis mascotas reportadas</h1>

            <p id="my-pets-message">
                Cargando mascotas...
            </p>

            <section id="my-pets-list"></section>

            <button
                id="publish-pet"
                type="button"
            >
                Publicar reporte
            </button>

            <button
                id="back-menu"
                type="button"
            >
                Volver
            </button>
        </main>
    `;
}

export async function setupMyPetsPage() {
  setupAppHeader();

  const petsList = document.querySelector<HTMLElement>("#my-pets-list")!;

  const message =
    document.querySelector<HTMLParagraphElement>("#my-pets-message")!;

  const publishButton =
    document.querySelector<HTMLButtonElement>("#publish-pet")!;

  const backButton = document.querySelector<HTMLButtonElement>("#back-menu")!;

  // Eventos de nav

  publishButton.addEventListener("click", () => {
    location.hash = "#/report-pet";
  });

  backButton.addEventListener("click", () => {
    location.hash = "#/";
  });

  // Obtener mascotas del usuario

  try {
    const pets = await getMyPets();

    // Estado vacío

    if (pets.length === 0) {
      message.textContent = "Aún no reportaste mascotas perdidas.";

      petsList.innerHTML = `
                <img
                    src="${emptyReportsImage}"
                    alt="No hay mascotas reportadas"
                    class="empty-reports-image"
                />
            `;

      return;
    }

    message.textContent = "";

    petsList.innerHTML = pets
      .map(
        (pet: Pet) => `
                    <article class="pet-card">
                        <img
                            src="${pet.imageUrl}"
                            alt="${pet.name}"
                            class="pet-card__image"
                        />

                        <div class="pet-card__content">
                            <h2>${pet.name}</h2>

                            <p>
                                ${
                                  pet.status === "lost"
                                    ? "Perdida"
                                    : "Encontrada"
                                }
                            </p>

                            <button
                                class="edit-pet-button"
                                data-pet-id="${pet.id}"
                                type="button"
                            >
                                Editar
                            </button>
                        </div>
                    </article>
                `,
      )
      .join("");

    const editButtons =
      document.querySelectorAll<HTMLButtonElement>(".edit-pet-button");

    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const petId = button.dataset.petId;

        location.hash = `#/pets/${petId}/edit`;
      });
    });
  } catch (error) {
    message.textContent =
      error instanceof Error
        ? error.message
        : "No se pudieron cargar tus mascotas";
  }
}
