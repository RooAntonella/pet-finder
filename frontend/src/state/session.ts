const TOKEN_KEY = "pet-finder-token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    const decoded = JSON.parse(atob(base64));

    const currentTime = Math.floor(Date.now() / 1000);

    return typeof decoded.exp !== "number" || decoded.exp <= currentTime;
  } catch {
    return true;
  }
}

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    removeToken();
    return null;
  }

  return token;
}

export function isLoggedIn() {
  return getToken() !== null;
}
