type CreateReportInput = {
  reporterName: string;
  reporterPhone: string;
  location: string;
};

export async function createReport(petId: number, data: CreateReportInput) {
  const response = await fetch(`http://localhost:3000/pets/${petId}/reports`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo enviar el reporte");
  }

  return result;
}
