import { AppError } from "../utils/AppError";
import { Pet } from "../models/Pet";
import { uploadPetImage } from "../services/cloudinaryService";
import {
  indexPet,
  removePetFromIndex,
  searchNearbyPetIds,
} from "../services/algoliaService";
import { Op } from "sequelize";

type CreatePetInput = {
  name: string;
  imageData: string;
  location: string;
  lat: number;
  lng: number;
};

export async function createPet(userId: number, data: CreatePetInput) {
  const { name, imageData, location, lat, lng } = data;

  if (
    !name ||
    !imageData ||
    !location ||
    lat === undefined ||
    lng === undefined
  ) {
    throw new Error("Faltan datos obligatorios");
  }

  const imageUrl = await uploadPetImage(imageData);

  const pet = await Pet.create({
    name: name.trim(),
    status: "lost",
    imageUrl,
    location: location.trim(),
    lat,
    lng,
    userId,
  });

  await indexPet({
    id: pet.id,
    name: pet.name,
    status: pet.status,
    imageUrl: pet.imageUrl,
    location: pet.location,
    lat: pet.lat,
    lng: pet.lng,
  });

  return pet;
}
export async function getMyPets(userId: number) {
  const pets = await Pet.findAll({
    where: {
      userId,
    },
    order: [["id", "DESC"]],
  });

  return pets;
}
type UpdatePetInput = {
  name?: string;
  imageData?: string;
  location?: string;
  lat?: number;
  lng?: number;
};

export async function updatePet(
  userId: number,
  petId: number,
  data: UpdatePetInput,
) {
  const pet = await Pet.findByPk(petId);

  if (!pet) {
    throw new AppError("Mascota no encontrada", 404);
  }

  if (pet.userId !== userId) {
    throw new AppError("No tenés permiso para editar esta mascota", 403);
  }

  if (data.name !== undefined) {
    pet.name = data.name.trim();
  }

  if (data.location !== undefined) {
    pet.location = data.location.trim();
  }

  if (data.lat !== undefined) {
    pet.lat = data.lat;
  }

  if (data.lng !== undefined) {
    pet.lng = data.lng;
  }

  if (data.imageData) {
    pet.imageUrl = await uploadPetImage(data.imageData);
  }

  await pet.save();

  await indexPet({
    id: pet.id,
    name: pet.name,
    status: pet.status,
    imageUrl: pet.imageUrl,
    location: pet.location,
    lat: pet.lat,
    lng: pet.lng,
  });

  return pet;
}
export async function markPetAsFound(userId: number, petId: number) {
  const pet = await Pet.findByPk(petId);

  if (!pet) {
    throw new AppError("Mascota no encontrada", 404);
  }

  if (pet.userId !== userId) {
    throw new AppError("No tenés permiso para modificar esta mascota", 403);
  }

  pet.status = "found";

  await pet.save();

  await removePetFromIndex(pet.id);

  return pet;
}
export async function deletePet(userId: number, petId: number) {
  const pet = await Pet.findByPk(petId);

  if (!pet) {
    throw new AppError("Mascota no encontrada", 404);
  }

  if (pet.userId !== userId) {
    throw new AppError("No tenés permiso para eliminar esta mascota", 403);
  }

  await removePetFromIndex(pet.id);

  await pet.destroy();

  return {
    message: "Mascota eliminada correctamente",
  };
}

export async function getNearbyPets(lat: number, lng: number) {
  const petIds = await searchNearbyPetIds(lat, lng);

  if (petIds.length === 0) {
    return [];
  }

  const pets = await Pet.findAll({
    where: {
      id: {
        [Op.in]: petIds,
      },
      status: "lost",
    },
  });

  return pets;
}
export async function getPetById(petId: number) {
  const pet = await Pet.findByPk(petId);

  if (!pet) {
    throw new AppError("Mascota no encontrada", 404);
  }

  return pet;
}
