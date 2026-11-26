type RegisterInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export async function registerUser(data: RegisterInput) {
  const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo crear la cuenta");
  }

  return result;
}

export async function loginUser(data: LoginInput) {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "No se pudo iniciar sesión");
  }

  return result;
}
