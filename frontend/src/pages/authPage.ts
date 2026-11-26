import { loginUser, registerUser } from "../services/authApi";

import { saveToken } from "../state/session";

export function renderLoginPage() {
  return `
    <main class="auth-page">
      <h1>Ingresar</h1>

      <form id="login-form" class="auth-form">
        <label>
          Email
          <input
            id="login-email"
            type="email"
            required
          />
        </label>

        <label>
          Contraseña
          <input
            id="login-password"
            type="password"
            required
          />
        </label>

        <button type="submit">
          Iniciar sesión
        </button>
      </form>

      <p id="auth-message"></p>

      <button
        id="go-register"
        type="button"
      >
        Crear cuenta
      </button>
    </main>
  `;
}

export function renderRegisterPage() {
  return `
    <main class="auth-page">
      <h1>Crear cuenta</h1>

      <form id="register-form" class="auth-form">
        <label>
          Email
          <input
            id="register-email"
            type="email"
            required
          />
        </label>

        <label>
          Contraseña
          <input
            id="register-password"
            type="password"
            required
          />
        </label>

        <label>
          Confirmar contraseña
          <input
            id="register-confirm-password"
            type="password"
            required
          />
        </label>

        <button type="submit">
          Registrarme
        </button>
      </form>

      <p id="auth-message"></p>

      <button
        id="go-login"
        type="button"
      >
        Ya tengo cuenta
      </button>
    </main>
  `;
}

export function setupLoginPage() {
  const loginForm = document.querySelector<HTMLFormElement>("#login-form");

  const message = document.querySelector<HTMLParagraphElement>("#auth-message");

  if (!loginForm || !message) {
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email =
      document.querySelector<HTMLInputElement>("#login-email")?.value;

    const password =
      document.querySelector<HTMLInputElement>("#login-password")?.value;

    if (!email || !password) {
      return;
    }

    try {
      message.textContent = "Iniciando sesión...";

      const result = await loginUser({
        email,
        password,
      });

      saveToken(result.accessToken);

      message.textContent = "Sesión iniciada correctamente ✅";

      location.hash = "#/";
    } catch (error) {
      message.textContent =
        error instanceof Error ? error.message : "No se pudo iniciar sesión";
    }
  });
}
export function setupRegisterPage() {
  const registerForm =
    document.querySelector<HTMLFormElement>("#register-form");

  const message = document.querySelector<HTMLParagraphElement>("#auth-message");

  if (!registerForm || !message) {
    return;
  }

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email =
      document.querySelector<HTMLInputElement>("#register-email")?.value;

    const password =
      document.querySelector<HTMLInputElement>("#register-password")?.value;

    const confirmPassword = document.querySelector<HTMLInputElement>(
      "#register-confirm-password",
    )?.value;

    if (!email || !password || !confirmPassword) {
      return;
    }

    try {
      message.textContent = "Creando cuenta...";

      await registerUser({
        email,
        password,
        confirmPassword,
      });

      message.textContent = "Cuenta creada correctamente ✅";

      location.hash = "#/login";
    } catch (error) {
      message.textContent =
        error instanceof Error ? error.message : "No se pudo crear la cuenta";
    }
  });
}
