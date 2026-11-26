import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { User } from "../models/User";

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
  const { email, password, confirmPassword } = data;

  if (!email || !password || !confirmPassword) {
    throw new Error("Faltan datos obligatorios");
  }

  if (password !== confirmPassword) {
    throw new Error("Las contraseñas no coinciden");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    throw new Error("El email ya está registrado");
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  const user = await User.create({
    email: normalizedEmail,
    name: null,
    location: null,
    passwordHash,
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    location: user.location,
  };
}

export async function loginUser(data: LoginInput) {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Email y contraseña son obligatorios");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const passwordIsValid = await argon2.verify(user.passwordHash, password);

  if (!passwordIsValid) {
    throw new Error("Credenciales inválidas");
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Falta JWT_SECRET en .env");
  }

  const accessToken = jwt.sign(
    {
      sub: user.id.toString(),
    },
    jwtSecret,
    {
      expiresIn: "15m",
    },
  );

  return {
    accessToken,
  };
}
