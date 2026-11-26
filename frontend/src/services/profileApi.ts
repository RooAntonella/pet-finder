import { getToken } from "../state/session";

export async function getMyProfile() {
  const token = getToken();

  const response = await fetch("http://localhost:3000/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudieron obtener tus datos");
  }

  return result;
}

type UpdateProfileInput = {
  name: string;
  location: string;
};

export async function updateMyProfile(data: UpdateProfileInput) {
  const token = getToken();

  const response = await fetch("http://localhost:3000/me", {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudieron actualizar tus datos");
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
