import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const auth = (req, res, next) => {
    let authToken = null;
  
    if (req.signedCookies.coderCookie) {
      authToken = req.signedCookies.coderCookie;
    }
  
    if (!authToken) {
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ error: "No hay usuarios autenticados / no existe token" });
    }
  
    try {
      const authenticatedUser = jwt.verify(authToken, config.general.PASSWORD);
      req.user = authenticatedUser;
  
      if (authenticatedUser.exp < Date.now() / 1000) {
        res.setHeader("Content-Type", "application/json");
        return res.status(401).json({ error: "Token ha expirado" });
      }
  
      next();
    } catch (error) {
      console.error(`Error inesperado en el servidor: ${error.message}`);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
        detalle: `${error.message}`,
      });
    }
  };