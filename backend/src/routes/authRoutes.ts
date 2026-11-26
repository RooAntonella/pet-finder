import { Router } from "express";

import { registerUser, loginUser } from "../controllers/authController";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al registrar usuario";

    res.status(400).json({
      error: message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al iniciar sesión";

    res.status(401).json({
      error: message,
    });
  }
});
