import { ticketModelo } from "./models/ticket.model.js";

export class TicketsDAO {
    async create(ticket){
        let newTicket = await ticketModelo.create(ticket)
        return newTicket.toJSON()
    }

    
}