import { Router } from "express";

import { requireAuth } from "../middleware/requireAuth";
import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
} from "../controllers/profileController";

export const profileRouter = Router();

profileRouter.get("/", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const profile = await getMyProfile(userId);

    res.json(profile);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al obtener perfil";

    res.status(404).json({
      error: message,
    });
  }
});

profileRouter.patch("/", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const profile = await updateMyProfile(userId, req.body);

    res.json(profile);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar perfil";

    res.status(400).json({
      error: message,
    });
  }
});
profileRouter.patch("/password", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const result = await updateMyPassword(userId, req.body);

    res.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar contraseña";

    res.status(400).json({
      error: message,
    });
  }
});
