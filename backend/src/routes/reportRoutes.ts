import { Router } from "express";

import { createReport } from "../controllers/reportController";
import { AppError } from "../utils/AppError";

export const reportRouter = Router();

reportRouter.post("/pets/:id/reports", async (req, res) => {
  try {
    const petId = Number(req.params.id);

    const report = await createReport(petId, req.body);

    res.status(201).json(report);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
      });
    }

    const message =
      error instanceof Error ? error.message : "Error al crear reporte";

    res.status(400).json({
      error: message,
    });
  }
});
