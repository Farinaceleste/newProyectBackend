import { usuariosService } from "../services/user.service.js"
import { Router } from "express";

const router = Router();

router.put('/premium/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await usuariosService.getUserById(uid);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.role = user.role === 'usuario' ? 'premium' : 'usuario';
        await usuariosService.createUser();

        res.status(200).json({ message: `Rol cambiado a ${user.role}` });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;