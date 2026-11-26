import { getToken } from "../state/session";

export type Pet = {
  id: number;
  name: string;
  status: "lost" | "found";
  imageUrl: string;
  location: string;
  lat: number;
  lng: number;
  userId: number;
};

export async function getNearbyPets(lat: number, lng: number): Promise<Pet[]> {
  const response = await fetch(
    `http://localhost:3000/pets-nearby?lat=${lat}&lng=${lng}`,
  );

  if (!response.ok) {
    throw new Error("No se pudieron obtener las mascotas cercanas");
  }

  return response.json();
}

export async function getMyPets(): Promise<Pet[]> {
  const token = getToken();

  const response = await fetch("http://localhost:3000/pets/mine", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudieron obtener tus mascotas");
  }

  return result;
}
type UpdatePetInput = {
  name?: string;
  imageData?: string;
  location?: string;
  lat?: number;
  lng?: number;
};

export async function getPetById(petId: number): Promise<Pet> {
  const response = await fetch(`http://localhost:3000/pets/${petId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo obtener la mascota");
  }

  return result;
}

export async function updatePet(petId: number, data: UpdatePetInput) {
  const token = getToken();

  const response = await fetch(`http://localhost:3000/pets/${petId}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo actualizar la mascota");
  }

  return result;
}

export async function markPetAsFound(petId: number) {
  const token = getToken();

  const response = await fetch(`http://localhost:3000/pets/${petId}/found`, {
    method: "PATCH",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo marcar como encontrada");
  }

  return result;
}

export async function deletePet(petId: number) {
  const token = getToken();

  const response = await fetch(`http://localhost:3000/pets/${petId}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo eliminar el reporte");
  }

  return result;
}
type CreatePetInput = {
  name: string;
  imageData: string;
  location: string;
  lat: number;
  lng: number;
};

export async function createPet(data: CreatePetInput) {
  const token = getToken();

  const response = await fetch("http://localhost:3000/pets", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo reportar la mascota");
  }

  return result;
}
