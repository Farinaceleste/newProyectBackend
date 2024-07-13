export class UsuariosDTO {

    constructor(users) {
        this.firstName = users.first_name
        this.lastName = users.last_name
        this.fullName = this.firstName + " " + this.lastName
        this.rol = users.role
        this.email = users.email
    }
}