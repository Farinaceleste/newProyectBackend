import { TicketsDAO as DAO } from "../dao/mongo/TicketMongoDAO.js";

class TicketService {
    constructor(dao){
        this.dao = new dao();
    }

    async create(){
        return await this.dao.create();
    }

}

export const ticketService = new TicketService(DAO);