import { Pet } from "../models/Pet";
import { Report } from "../models/Report";
import { AppError } from "../utils/AppError";
import { User } from "../models/User";
import { sendSightingEmail } from "../services/emailService";

type CreateReportInput = {
  reporterName: string;
  reporterPhone: string;
  location: string;
};

export async function createReport(petId: number, data: CreateReportInput) {
  const { reporterName, reporterPhone, location } = data;

  if (!reporterName || !reporterPhone || !location) {
    throw new AppError("Faltan datos obligatorios", 400);
  }

  const pet = await Pet.findByPk(petId);

  if (!pet) {
    throw new AppError("Mascota no encontrada", 404);
  }

  if (pet.status !== "lost") {
    throw new AppError("Esta mascota ya fue encontrada", 400);
  }

  const owner = await User.findByPk(pet.userId);

  if (!owner) {
    throw new AppError("Dueño de la mascota no encontrado", 404);
  }

  const report = await Report.create({
    petId: pet.id,
    reporterName: reporterName.trim(),
    reporterPhone: reporterPhone.trim(),
    location: location.trim(),
  });

  await sendSightingEmail({
    ownerEmail: owner.email,
    petName: pet.name,
    reporterName: report.reporterName,
    reporterPhone: report.reporterPhone,
    location: report.location,
  });

  return report;
}
