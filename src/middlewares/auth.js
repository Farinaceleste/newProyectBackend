
import { UsuariosDTO } from "../DTO/UsuariosDTO.js";

export const auth = (role) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "No hay usuario autenticado." });
    }

    const userDTO = new UsuariosDTO(req.user);

    if (role && userDTO.role !== role) {
      return res.status(403).json({ error: "No tienes permisos suficientes para acceder a este recurso." });
    }

    req.userDTO = userDTO;  
    next();
  };
};