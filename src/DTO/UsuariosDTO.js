export default class UsuariosDTO {
    constructor(user) {
        if (!user || typeof user !== 'object') {
            throw new Error('Usuario inválido');
        }

        this.firstName = user.first_name ? user.first_name.toUpperCase() : "NO ESPECIFICADO";
        this.lastName = user.last_name ? user.last_name.toUpperCase() : "NO ESPECIFICADO";
        this.fullName = this.firstName;

        if (user.last_name) {
            this.fullName += ` ${this.lastName}`;
        }

        this.role = user.role || "user"; 
        this.email = user.email || "No especificado"; 
    }
}