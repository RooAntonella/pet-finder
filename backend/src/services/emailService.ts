import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("Falta RESEND_API_KEY en las variables de entorno");
}

const resend = new Resend(apiKey);

type SendSightingEmailInput = {
  ownerEmail: string;
  petName: string;
  reporterName: string;
  reporterPhone: string;
  location: string;
};

export async function sendSightingEmail(data: SendSightingEmailInput) {
  const { ownerEmail, petName, reporterName, reporterPhone, location } = data;

  const { error } = await resend.emails.send({
    from: "Pet Finder <onboarding@resend.dev>",
    to: [ownerEmail],
    subject: `¡Vieron a ${petName}!`,
    html: `
      <h2>Hay nueva información sobre ${petName}</h2>

      <p><strong>Nombre:</strong> ${reporterName}</p>
      <p><strong>Teléfono:</strong> ${reporterPhone}</p>
      <p><strong>Dónde lo vio:</strong> ${location}</p>
    `,
  });

  if (error) {
    throw new Error(`Error enviando email: ${error.message}`);
  }
}
