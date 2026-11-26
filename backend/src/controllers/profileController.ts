import { User } from "../models/User";
import argon2 from "argon2";

export async function getMyProfile(userId: number) {
  const user = await User.findByPk(userId, {
    attributes: ["id", "email", "name", "location"],
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
}

type UpdateProfileInput = {
  name?: string;
  location?: string;
};

export async function updateMyProfile(
  userId: number,
  data: UpdateProfileInput,
) {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (data.name !== undefined) {
    user.name = data.name.trim();
  }

  if (data.location !== undefined) {
    user.location = data.location.trim();
  }

  await user.save();

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    location: user.location,
  };
}
type UpdatePasswordInput = {
  password: string;
  confirmPassword: string;
};

export async function updateMyPassword(
  userId: number,
  data: UpdatePasswordInput,
) {
  const { password, confirmPassword } = data;

  if (!password || !confirmPassword) {
    throw new Error("Faltan datos obligatorios");
  }

  if (password !== confirmPassword) {
    throw new Error("Las contraseñas no coinciden");
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  user.passwordHash = passwordHash;

  await user.save();

  return {
    message: "Contraseña actualizada correctamente",
  };
}
