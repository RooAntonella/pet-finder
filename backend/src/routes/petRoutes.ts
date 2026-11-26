import { Router } from "express";
import { AppError } from "../utils/AppError";
import { requireAuth } from "../middleware/requireAuth";
import {
  createPet,
  getMyPets,
  updatePet,
  markPetAsFound,
  deletePet,
  getNearbyPets,
  getPetById,
} from "../controllers/petController";

export const petRouter = Router();

petRouter.post("/", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const pet = await createPet(userId, req.body);

    res.status(201).json(pet);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al crear mascota";

    res.status(400).json({
      error: message,
    });
  }
});
petRouter.get("/mine", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const pets = await getMyPets(userId);

    res.json(pets);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al obtener mascotas";

    res.status(400).json({
      error: message,
    });
  }
});
petRouter.get("/:id", async (req, res) => {
  try {
    const petId = Number(req.params.id);

    const pet = await getPetById(petId);

    res.json(pet);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    const message =
      error instanceof Error ? error.message : "Error al obtener mascota";

    res.status(400).json({
      error: message,
    });
  }
});
petRouter.patch("/:id", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const petId = Number(req.params.id);

    const pet = await updatePet(userId, petId, req.body);

    res.json(pet);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    const message =
      error instanceof Error ? error.message : "Error al actualizar mascota";

    res.status(400).json({
      error: message,
    });
  }
});
petRouter.patch("/:id/found", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const petId = Number(req.params.id);

    const pet = await markPetAsFound(userId, petId);

    res.json(pet);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    const message =
      error instanceof Error
        ? error.message
        : "Error al marcar mascota como encontrada";

    res.status(400).json({
      error: message,
    });
  }
});

petRouter.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const petId = Number(req.params.id);

    const result = await deletePet(userId, petId);

    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    const message =
      error instanceof Error ? error.message : "Error al eliminar mascota";

    res.status(400).json({
      error: message,
    });
  }
});

export const nearbyPetRouter = Router();

nearbyPetRouter.get("/", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({
        error: "Latitud y longitud son obligatorias",
      });
    }

    const pets = await getNearbyPets(lat, lng);

    res.json(pets);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al buscar mascotas cercanas";

    res.status(400).json({
      error: message,
    });
  }
});
