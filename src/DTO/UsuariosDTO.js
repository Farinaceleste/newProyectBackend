export default class UsuariosDTO {

    static getUserTokenFrom = (user) => {
        return {
            name: `${user.first_name} ${user.last_name}`,
            rol: user.rol,
            email: user.email

        }

    }
}