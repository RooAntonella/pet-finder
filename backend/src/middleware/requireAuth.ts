import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = {
  sub: string;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: "Falta token de autenticación",
    });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Token inválido",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Falta JWT_SECRET en .env");
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;

    res.locals.userId = Number(payload.sub);

    next();
  } catch {
    return res.status(401).json({
      error: "Token inválido o vencido",
    });
  }
}
