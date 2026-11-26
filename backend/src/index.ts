import express from "express";
import cors from "cors";
import { reportRouter } from "./routes/reportRoutes";
import { petRouter, nearbyPetRouter } from "./routes/petRoutes";
import { profileRouter } from "./routes/profileRoutes";
import { sequelize } from "./db";
import { authRouter } from "./routes/authRoutes";

import "./models/User";
import "./models/Pet";
import "./models/Report";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());

app.use(
  express.json({
    limit: "15mb",
  }),
);
app.use("/auth", authRouter);
app.use("/me", profileRouter);
app.use("/pets", petRouter);
app.use("/pets-nearby", nearbyPetRouter);
app.use(reportRouter);
app.get("/", (req, res) => {
  res.json({
    message: "Pet Finder API funcionando 🐾",
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Conexión a PostgreSQL exitosa ✅");

    await sequelize.sync({
      alter: true,
    });

    console.log("Tablas sincronizadas ✅");

    app.listen(PORT, (error) => {
      if (error) {
        console.error("Error al iniciar servidor:", error);
        return;
      }

      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando Pet Finder API:", error);
  }
}

startServer();
